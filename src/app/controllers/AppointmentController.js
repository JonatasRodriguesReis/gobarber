import Appointment from '../models/Appointment'
import User from '../models/User'
import * as Yup from 'yup'
import Appointment from '../models/Appointment'
import File from '../models/File'
import { startOfHour, parseISO, isBefore, format,subHours} from 'date-fns'
import pt from 'date-fns/locale/pt'
import Notification from '../schemas/notification'
import Mail from '../../lib/Mail'

class AppointmentController{
    async store(req,res){
        const schema = Yup.object().shape({
            date:Yup.date().required(),
            provider_id:Yup.date().required(),
            date:Yup.date().required(),
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({error:'Validation appointment fails'})
        }

        const {provider_id,date} = req.body

        /**
         * Check if provider_id is a provider
         */

        const isProvider = await User.findOne({
            where:{id:provider_id,provider:true}
        })

        if(!isProvider)
            return res.status(401).json({error:'You can only create appointments with providers'})

        /**
         * Check if provider is same than user
         */

        if(req.userId == provider_id)
            return res.status(401).json('Provider can not be the same than user')

        /**
         * Check for past dates
         */

        const hourStart = startOfHour(parseISO(date))
        if(isBefore(hourStart, new Date())){
            return res.status(400).json({error:'Past dates are not permitted'})
        }

        const checkAvailability = await Appointment.findOne({
            where:{
                provider_id,
                canceled_at: null,
                date:hourStart
            }
        })

        if(checkAvailability){
            return res.status(400).json({error:'Appointment date is not available'})
        }
        
        const appointment =  await Appointment.create({
            user_id:req.userId,
            provider_id,
            date:hourStart
        })

        /**
         * Notify appointment provider
         */
        
        const user  = await User.findByPk(req.userId)
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            {locale:pt}
        )
        await Notification.create({
            content:`Novo agendamento de ${user.name} para ${formattedDate}`,
            user:provider_id
        })

        return res.status(200).json(appointment)
    }

    async index(req,res){
        const {page = 1} = req.query
        const appointments = await Appointment.findAll({
            where:{
                user_id: req.userId,canceled_at:null
            },
            order:['date'],
            attributes:['id','date'],
            limit:20,
            offset: (page - 1) * 20,
            include:[
                {
                    model:User,
                    as:'provider',
                    attributes:['id','name'],
                    include:[
                        {
                            model:File,
                            as:'avatar',
                            attributes:['id','path','url']
                        }
                    ]
                }
            ] 
        })

        return res.status(200).json(appointments)
    }

    async delete(req,res){
        const appointment = await Appointment.findByPk(req.params.id,{
            include:[
                {
                    model: User,
                    as: 'provider',
                    attributes: ['name','email']
                },
                {
                    model:User,
                    as:'user',
                    attributes:['name']
                }
            ]
        })

        if(appointment.user_id != req.userId)
            return res.status(401).json({error:"You can't cancel this appointment."})

        const dateSub = subHours(appointment.date,2)
        if(isBefore(dateSub,new Date()))
            return res.status(401).json({
                erro: "You can only cancle appointments 2 hours in advance."
            })
        
        appointment.canceled_at = new Date()
        await appointment.save()

        

        return res.status(200).json(appointment)
    }
}

export default new AppointmentController() 