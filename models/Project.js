import mongoose from "mongoose";

 const projectsSchema = mongoose.Schema({
      nombre : {
         type : String,
         trim: true,
         required: true
      },
      description :{
         type : String,
         trim: true,
         required: true
      },
      fechaEntrega : {
        type : Date,
        default : Date.now()
      },
      cliente : {
        type : String,
        trim: true,
        required: true
     },
     creador : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
     },
     tareas : [
          {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Tarea",
          }
     ],
     colaboradores : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
         
        }
     ]

 },
 {
    timestamps : true
 }
 ); 

 const Project = mongoose.model('Project', projectsSchema); 

 export default Project;