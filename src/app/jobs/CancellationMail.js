import Mail from '../../lib/Mail'
import {format} from 'date-fns'
import pt from 'date-fns/locale/pt'
class CancellationMail{
    get key(){
        return "CancelationMail"
    }

    async handle({data,}){
        Mail.sendEmail({
            to:`${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template:'cancellation',
            context:{
                provider: appointment.provider.name,
                user:appointment.user.name,
                date:  format(
                    appointment.date,
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    {locale:pt}
                )
            }
        })
    }
}

export default new CancellationMail();