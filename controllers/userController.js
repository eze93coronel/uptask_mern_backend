import User from "../models/User.js"
import generateId from "../helpers/generateId.js"; 
import generatedJWT from "../helpers/generateJWT.js"; 
import {emailRegister,emailForgetPassword} from '../helpers/email.js'

const registrar = async (req, res) => {
//evitar los registro duplicados 
const {email} = req.body;
const existUser = await User.findOne({email: email});

if(existUser){
    const error = new Error(`the user is already registered`)
    return res.status(400).json({msg : error.message})
}

     try {
        const user = new User(req.body);
        user.token = generateId();
          await user.save()
   //enviar el email con la confirmacion
     emailRegister({
         email : user.email, 
         nombre : user.nombre, 
         token : user.token
     })

        res.json({msg:"user created correctly, check your email to confirm your account"})
     } catch (error) {
          console.log(error)
     }

};

//fn de authenticate
const authenticate = async (req, res) => {
      
    const {email,password } = req.body;

       //comprobra i el uusraio existe 
       const user = await User.findOne({email});
       if(!user){
            const error = new Error(`Username does not exist`);
            return res.status(404).json({message : error.message});
       }
       //comprobar si el usuario esta confimado
       if(!user.confirmado){
        const error = new Error(`your user has not been confirmed`);
        return res.status(403).json({message : error.message});
   }
       //comprobar su password
       if(await user.checkPassword(password)){
           res.json({
            _id : user._id,
            nombre : user.nombre,
            email : user.email,
            token : generatedJWT(user._id)
           })
       }else{
        const error = new Error(`the password is wrong`);
        return res.status(403).json({message : error.message});
   }
       }

       

       const confirmation = async (req, res) => {
            const {token} = req.params;
              
            const userConfirm = await User.findOne({token});

            if(!userConfirm){
                const error = new Error(`that token is invalid`);
                return res.status(403).json({message : error.message});
            }
            try {
                userConfirm.confirmado = true
                userConfirm.token = "";
                
            await userConfirm.save();
            return res.json({message : "user confirmed successfully, wooo yes men"})


            } catch (error) {
                  console.error(error)
            }
        
       }   

       const forgetPassword = async (req, res) => {
           const {email} = req.body

           const user = await User.findOne({email});
           if(!user){
                const error = new Error(`Username does not exist`);
                return res.status(404).json({message : error.message});
           }

           try {
              user.token = generateId();
               await user.save();
               
         //enviar el email al usuario 
             emailForgetPassword({
                email : user.email, 
                nombre : user.nombre, 
                token : user.token
             })
               res.json({msg : 'We have sent a new email with the instructions'});
           } catch (error) {
            
           }
       }

  const checkToken = async (req, res) => {
     const {token } = req.params; 
     const tokenValid = await User.findOne({token});
     if(tokenValid) {
         res.json({message :"the token is valid, the user exists"})
     }else {
        const error = new Error(`token is not valid, error`)
        return res.status(404).json({message: error.message})
     }
  }

  const newPassword = async (req, res) => {
        const {token} = req.params;
        const {password} = req.body
        
        const user = await User.findOne({token});
        if(user) {
           
            user.password = password; // neuvo password que se esta pasando en el cuerpo de la peticion
            user.token = "";
             try {
                await user.save();
            res.json({message : "password modified successfully"})
             } catch (error) {
                console.log(error)
             }
        }else {
           const error = new Error(`token is not valid, error`)
           return res.status(404).json({message: error.message})
        }
  }

  const perfil = async (req, res) => {
    const {user} = req
    res.json(user)
  }

export {
    registrar,
    authenticate,
    confirmation,
    forgetPassword,
    checkToken,
    newPassword,
    perfil
}