const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        }) // for the second arg, can provide object to avoid warnigns
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }catch(e){
        console.log(error(err))
        process.exit(1) // end and exit out of program
    }
}

module.exports = connectDB