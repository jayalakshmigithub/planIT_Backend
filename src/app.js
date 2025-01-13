import express from 'express';
import http from 'http'
import cookieParser from 'cookie-parser'
import config from './config/config.js';
import dbConnect from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';
import {Server} from 'socket.io'

import userRoutes from '../src/routes/userRoutes.js';
import { refreshTokenController } from './controllers/refreshTokecController.js';
import adminRouter from './routes/adminRoutes.js';

import { initializeSocket } from './sockets/socketConnection.js';


const app = express()


const server = http.createServer(app)
const io = new Server(server, {
    cors:{
        origin:config.API_URL,
        methods:['GET','POST','PUT'],
        credentials:true
    }
})

app.set('io',io)

dbConnect()
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public/'))
app.use(cors({
    origin:config.API_URL,
    methods: ['GET', 'POST', 'PUT' , 'DELETE'],
    credentials:true
}))
 
initializeSocket(io);

app.use(morgan('dev')); 
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", `${config.API_URL}`);
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use((req,res,next)=>{
    res.setHeader('Cross-Origin-Opener-Policy','same-origin')
    res.setHeader('Cross-Origin-Embeded-Policy','require-corp')
    next()
});
    
app.use('/api/user',userRoutes)
app.use('/api/admin',adminRouter)

app.post('/api/refresh-token', refreshTokenController);

server.listen(config.PORT,()=>{
    console.log(`server running at ${config.PORT} `)
});