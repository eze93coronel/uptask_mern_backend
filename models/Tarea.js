import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
   nombre : {
     type: String,
     trim: true,
     require : true
   },
   description : {
    type: String,
    trim: true,
    require : true
   },
   estado : { 
    type: Boolean,
    default: false
   },
   fechaEntrega : {
    type : Date,
    required : true,
    default :  Date.now()
   },
   prioridad : {
    type: String,
    trim: true,
    enum : ["Baja","Media","Alta"]
   },
   proyecto : {
     type : mongoose.Schema.Types.ObjectId,
     ref : "Project"
   },
   completado : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
   }
},{
    timestamps : true
})

const Tarea = mongoose.model('Tarea',tareaSchema);

export default Tarea;