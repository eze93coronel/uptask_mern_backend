 import Project from "../models/Project.js"
 import User from "../models/User.js"
  import Tarea from "../models/Tarea.js"
 const getProjects = async(req, res)=> {
    const projects = await Project.find({
      '$or':[
          {colaboradores: {$in: req.user}},
          { creador: {$in: req.user}}
      ]
    }).select('-tareas');

    res.json(projects)
 }

 const newProject = async (req, res)=> {

       const project = new Project(req.body);
       project.creador = req.user._id;

       try {
          const projectStored = await project.save();
          res.json(projectStored);
       } catch (error) {
           console.log(error)
       }

 }

 const getProject = async (req, res) => {
     const {id} = req.params;
     
     const project = await Project.findById(id).populate({path : 'tareas', populate :{path : 'completado', select: 'nombre'}}).populate("colaboradores","nombre email")
     
   if(!project) { 
     const error = new Error(`project not found`);
     return res.status(404).json({message: error.message})
   }

   if( project.creador.toString() !== req.user._id.toString()&& !project.colaboradores.some(colaborador => colaborador._id.toString() === req.user._id.toString())){
    const error = new Error(`invalid action you do not have the permissions`)
    return res.status(401).json({message: error.message})
   }
  
   // obteneer las tareas de un proyecto
   res.json( project )
 }

 const editProject = async (req,res)=> {
    
    const {id} = req.params;
     
    const project = await Project.findById(id);
    
  if(!project) { 
    const error = new Error(`project not found`);
    return res.status(404).json({message: error.message})
  }

  if(   project.creador.toString() !== req.user._id.toString()){
   const error = new Error(`invalid action you do not have the permissions`)
   return res.status(401).json({message: error.message})
  }
  
  project.nombre = req.body.nombre  || project.nombre;
  project.description = req.body.description || project.description;
  project.fechaEntrega = req.body.fechaEntrega || project.fechaEntrega;
  project.cliente = req.body.cliente || project.cliente;
  
  try {
    const projectStored = await project.save();
    res.json(projectStored);
    
  } catch (error) {
     console.log(error);
  }
   
 }

 const deleteProject = async (req,res)=> {

    const {id} = req.params;
     
    const project = await Project.findById(id);
    
  if(!project) { 
    const error = new Error(`project not found`);
    return res.status(404).json({message: error.message})
  }

  if(   project.creador.toString() !== req.user._id.toString()){
   const error = new Error(`invalid action you do not have the permissions`)
   return res.status(401).json({message: error.message})
  } 

  try {
        await project.deleteOne();
        res.json({message: "project removed successfully"})
  } catch (error) {

    console.log(error)
    
  }
  
        
 }
const getCollabators = async (req,res)=> {
   const {email} = req.body
   const user = await User.findOne({email: email}).select("-password -confirmado -token -updateAt -createdAt -__v")
   if(!user){
     const error = new Error(`User  email not found`)
     return res.status(404).json({msg: error.message})
   }
   res.json(user)

}

 const addCollabator = async (req,res) =>{
     const project = await Project.findById(req.params.id)

     if(!project){
       const error = new Error(`Project not found men`)
       return res.status(404).json({msg: error.message})
     }
     if(project.creador.toString() !== req.user._id.toString()){
      const error = new Error(`you are not the creator of the project you cannot add collaborators`)
      return res.status(404).json({msg: error.message})
     }

    const {email} = req.body
   const user = await User.findOne({email}).select("-password -confirmado -token -updateAt -createdAt -__v")

   if(!user){
     const error = new Error(`User  email not found`)
     return res.status(404).json({msg: error.message})
   }
  

   //revisar que  o este en el project
   if(project.colaboradores.includes(user._id)){
    const error = new Error(`the user already belongs to the project`)
    return res.status(404).json({msg: error.message})
   }

   project.colaboradores.push(user._id)
   await project.save()
  return res.json({message:'collaborator added successfully'})
 }

 const deleteCollabotor = async (req,res)=>{
      
  const project = await Project.findById(req.params.id)

     if(!project){
       const error = new Error(`Project not found men`)
       return res.status(404).json({msg: error.message})
     }
     if(project.creador.toString() !== req.user._id.toString()){
      const error = new Error(`you are not the creator of the project you cannot add collaborators`)
      return res.status(404).json({msg: error.message})
     }

   // se puede eliminar colaborador
     project.colaboradores.pull(req.body.id)
     
     await project.save()
    return res.json({message:'collaborator delete successfully'})

 }



export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addCollabator,
    deleteCollabotor,
    getCollabators
    
}