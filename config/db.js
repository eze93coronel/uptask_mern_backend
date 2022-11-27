import mongoose from "mongoose";

const conecctDB = async () =>{
    try {
        const connection = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser : true,
            useUnifiedTopology:true
        });
        const url = `${connection.connection.host}${connection.connection.port}`;
        console.log(`Mongop db conetado en : ${url}`);
    } catch (error) {
         console.error(`error ${error.message}`);

        process.exit(1);
    }
}
export default conecctDB;