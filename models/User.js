import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const usersSchema = mongoose.Schema({
      nombre : {
        type: String,
        required: true,
        trim : true
      },

      password : {
        type: String,
        required: true,
        trim : true
      }, 
      email : {
        type: String,
        required: true,
        trim : true,
        unique : true
      },

      token : {
        type : String
      },
      confirmado : {
        type : Boolean,
        default: false
      }
},{
    timestamp : true
});

//middleware para hashear los password
usersSchema.pre('save',  async function(next){
if(!this.isModified('password')){
  next();
}

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password,salt);

})

usersSchema.methods.checkPassword = async function(passwordForm){
    return await bcrypt.compare(passwordForm,this.password);
}

const User = mongoose.model("User",usersSchema);

export default User;