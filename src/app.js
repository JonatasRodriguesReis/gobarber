import 'dotenv/config'
 
import express from 'express'
import routes from './routes'
import path from 'path'
import './database/index'

class App {
    constructor() {
        this.server = express()
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.server.use('/files',express.static(path.resolve(__dirname,'..','temp','uploads')))
        this.server.use(express.json())
    }

    routes() {
        this.server.use(routes)
    }
}

export default new App().server