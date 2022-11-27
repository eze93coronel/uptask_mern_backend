import nodemailer from 'nodemailer';

  export const emailRegister =  async(datos)=>{
    const {email,nombre,token} = datos;

    const  transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      
      //informacion del email
      const info = await transport.sendMail({
        from: '"Uptask - Project Manager" <cuentas@uptask.com>',
        to : email,
        subject: "Uptask - Check Your Account",
        text :" check your account In Uptask",
        html : ` <p>Hello : ${nombre}  check your account In Uptask</p>
           
        <p>  your account is already ready you just have to check it in the following link : 
            
             <a href="${process.env.FRONTEND_URL}/confirmar/${token}">check account</a>

             <p> If you did not create this account, you can ignore the message</p>
    
        `
      })
}



  export const emailForgetPassword =  async(datos)=>{
    const {email,nombre,token} = datos;



    const  transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
      });
      
      //informacion del email
      const info = await transport.sendMail({
        from: '"Uptask - Project Manager" <cuentas@uptask.com>',
        to : email,
        subject: "Uptask - reset your password ",
        text :" reset your password and  Uptask",
        html : ` <p>Hello : ${nombre}  you requested to reset your password</p>
           
        <p>  follow the following link to generate a new password : 
            
             <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reset Password</a>

             <p> if you did not request this email , you can ignore the message</p>
    
        `
      })
}