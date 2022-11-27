import Project from "../models/Project.js";
import Tarea from "../models/Tarea.js";

const addTarea = async (req, res) => {
    const {proyecto} = req.body;
 
    const existProject = await Project.findById(proyecto);

if(!existProject){
     const error = new Error(`the project does not exist`)
     return res.status(404).json({message: error.message})
}

if(existProject.creador.toString() !== req.user._id.toString()){
    const error = new Error(`hey!!! you do not have the proper permissions to add tasks!!`)
    return res.status(403).json({message: error.message})
}
   try {
      const tareaStored = await Tarea.create(req.body);
    //almacenar el id en el proyecto 
    existProject.tareas.push(tareaStored._id)
    await existProject.save();

      res.json(tareaStored)
   } catch (error) {
      console.log(error);
   }
}

const getTarea = async (req, res) => {
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error(`task not found`)
        return res.status(404).json({message: error.message})
    }
    
    if(tarea.proyecto.creador.toString() !== req.user._id.toString()){
        const error = new Error(`do not consider the project id with the task!!`)
        return res.status(403).json({message: error.message})
    }
    res.json(tarea)
}

const updateTarea = async (req, res) =>{

    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error(`task not found`)
        return res.status(404).json({message: error.message})
    }
    
    if(tarea.proyecto.creador.toString() !== req.user._id.toString()){
        const error = new Error(`do not consider the project id with the task!!`)
        return res.status(403).json({message: error.message})
    }

    tarea.nombre = req.body.nombre || tarea.nombre;
    tarea.description = req.body.description || tarea.description;
    tarea.prioridad = req.body.prioridad || tarea.prioridad;
    tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega;

     try {
          const tareaStored = await tarea.save();
          res.json(tareaStored)
     } catch (error) {
         console.log(error)
     }
}

const deleteTarea = async (req, res) =>{
      
    
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto");

    if(!tarea) {
        const error = new Error(`task not found`)
        return res.status(404).json({message: error.message})
    }
    
    if(tarea.proyecto.creador.toString() !== req.user._id.toString()){
        const error = new Error(`do not consider the project id with the task!!`)
        return res.status(403).json({message: error.message})
    }

    try {
        const proyecto = await Project.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)
       
         
          await Promise.allSettled([  await proyecto.save(), await tarea.deleteOne()])
          res.json({message : "task removed successfully"})
    } catch (error) {
          console.log(error)
    } 

}

const changeCondition = async (req, res) =>{
      
    
    const {id} = req.params;
    const tarea = await Tarea.findById(id).populate("proyecto")


    if(!tarea) {
        const error = new Error(`task not found`)
        return res.status(404).json({message: error.message})
    }
    if(tarea.proyecto.creador.toString() !== req.user._id.toString() && !tarea.proyecto.colaboradores.some((colaborador) => colaborador._id.toString() === req.user._id.toString()) ){
        const error = new Error(`no eres ni el creador ni colaborador accion no valida!!`)
        return res.status(403).json({message: error.message})
    }

     tarea.estado = !tarea.estado;
     tarea.completado = req.user._id
     await tarea.save();
    const tareaNueva = await Tarea.findById(id).populate("proyecto").populate("completado")

     res.json(tareaNueva)
    
}

export {
    addTarea,
    getTarea,
    updateTarea,
    deleteTarea,
    changeCondition


}
