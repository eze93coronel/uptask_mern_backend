import express from "express";
import checkAuth from "../middleware/checkAuth.js"
import {  addTarea,
    getTarea,
    updateTarea,
    deleteTarea,
    changeCondition} from '../controllers/tareaController.js';

    const router = express.Router();

    router.post('/',checkAuth,addTarea)
    router.get('/:id', checkAuth,getTarea)
    router.put('/:id',checkAuth,updateTarea)
    router.delete('/:id',checkAuth,deleteTarea)

    //rutas para cambiar el estasdo de un tarea 
    router.post("/estado/:id",checkAuth,changeCondition)

    export default router