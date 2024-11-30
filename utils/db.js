const mongoose = require('mongoose');

const connectDB = async () => {
    try {
     const connectionInstance = await mongoose.connect("mongodb+srv://av0232016:NFm2gHc0pets0MGt@food.a6znm.mongodb.net/?retryWrites=true&w=majority&appName=Food")
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error.message);
        process.exit(1)
    }
}

module.exports= connectDB  
