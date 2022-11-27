import express from "express";
import {registrar,authenticate,confirmation,forgetPassword,checkToken,newPassword,perfil} from '../controllers/userController.js';
import checkAuth from "../middleware/checkAuth.js";
const router = express.Router();

//autenticar , registrar usuarios 

router.post('/',registrar)
router.post('/login',authenticate)
router.get('/confirmar/:token',confirmation)
router.post('/olvide-password',forgetPassword);
router.get('/olvide-password/:token',checkToken)
router.post('/olvide-password/:token',newPassword)

router.get('/perfil',checkAuth,perfil)





export default router;