import express from "express";

import { getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addCollabator,
    deleteCollabotor,
    getCollabators
    } from '../controllers/projectController.js';
 import checkAuth from "../middleware/checkAuth.js";   

 const router = express.Router();
 
 router.get('/', checkAuth,getProjects)
 router.post('/', checkAuth,newProject)
 router.get("/:id",checkAuth,getProject);
 router.put("/:id",checkAuth,editProject);
 router.delete("/:id",checkAuth,deleteProject);

  router.post('/colaboradores',checkAuth,getCollabators)
 router.post('/colaboradores/:id',checkAuth,addCollabator)
 router.post("/eliminar-colaborador/:id",checkAuth,deleteCollabotor) 



 export default router