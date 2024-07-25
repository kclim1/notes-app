const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const connectDB = async()=>{
    try{
        const DBconnection = await mongoose.connect('process.env.MONGODB_URI')
        console.log(`connected to database: ${DBconnection.connection.host}`)
    }catch(error){
        console.error(error)
    }
}

module.exports = connectDB ; 