
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import  conecctDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'

const app = express();
//habilitar que lea la info de tipo json
app.use(express.json())
dotenv.config()

conecctDB();

//configurar cors 
const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin : function(origin,callback) {
      //  console.log(origin)
        if(whitelist.includes(origin)){
            //PUEDE CONULTAR LA API
               callback(null,true)
        }else{
         // NO TIENE PERMITIDO EN REQUEST
         callback(new Error(`Error de Cors`))
        }
    }
}

app.use(cors(corsOptions));

//routing 
app.use('/api/users',userRoutes);
app.use('/api/projects',projectRoutes);
app.use('/api/tareas',tareaRoutes)



const PORT = process.env.PORT || 4000;

 const servidor = app.listen(PORT,()=>{
    console.log(`servidor corriendo en el puerto  ${PORT}`);
});

//socket io 

import {Server} from 'socket.io'

const io = new Server(servidor,{
    pingTimeout : 60000,
    cors :{
        origin : process.env.FRONTEND_URL,
    }
});
io.on('connection',(socket) => {
  //  console.log('conectado a socket io');

    // definir los eventos de socket io 
   socket.on("abrir proyecto",(proyecto) => {
      socket.join(proyecto)
   });
   socket.on('nueva tarea',( tarea) => {
    
    socket.to(tarea.proyecto).emit("tarea agregada",tarea)

   });

   socket.on('eliminar tarea', tarea =>{
      socket.to(tarea.proyecto).emit("tarea eliminada", tarea)
   });

   socket.on('actualizar tarea', tarea =>{
     socket.to(tarea.proyecto._id).emit('tarea actualizada', tarea)
   })
   socket.on('cambiar estado', tarea =>{
       socket.to(tarea.proyecto._id).emit('nuevo estado', tarea)
   })
})