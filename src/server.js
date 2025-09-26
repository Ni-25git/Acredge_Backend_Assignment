const express = require('express');
const connectDB = require('../config/db');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const propertyRoutes = require('../routes/propertyRoutes');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT

app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use('/properties', propertyRoutes);




app.listen(PORT, async ()=>{
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Error in server running", error.message)
    }
})
