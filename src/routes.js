import {Router} from 'express'
import UserController from './app/controllers/userController'
import SessionController from './app/controllers/sessionController'
import ProviderController from './app/controllers/ProviderController'
import authHeader from './app/middlewares/auth'
import multerConfig from './config/multer'
import multer from 'multer'
import FileController from './app/controllers/FileController'
import AppointmentController from './app/controllers/AppointmentController'
import ScheduleController from './app/controllers/ScheduleController'
import NotificationController from './app/controllers/NotificationController'
const routes = new Router()
const upload = multer(multerConfig)
routes.post('/users',UserController.store)
routes.post('/sessions',SessionController.store)

routes.use(authHeader)
routes.put('/update',UserController.update)

routes.post('/files',upload.single('file'),FileController.store)

routes.get('/providers',ProviderController.index)

routes.post('/appointments',AppointmentController.store)

routes.get('/appointments',AppointmentController.index)

routes.delete('/appointments/:id',AppointmentController.delete)

routes.get('/schedule',ScheduleController.index)

routes.get('/notifications',NotificationController.index)

routes.put('/notifications/:id',NotificationController.update)
export default routes