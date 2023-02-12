const express = require('express');
const mongoose = require ("mongoose") ;
const dotenv = require ("dotenv");
const helmet = require ("helmet") ;
const morgan = require( "morgan");
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
dotenv.config();


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URL,()=>{
    console.log("Connected to MongoDB");
});

const port = process.env.PORT || 8800;
const app = express();
// middleware 
app.use(express.json());
app.use(helmet()) ;
app.use(morgan("common"));

app.use('/api/users',userRoute);
app.use('/api/auth',authRoute);
app.use('/api/posts',postRoute);

app.listen(port,()=>{
    console.log(`Backend server running on ${port}`);
})