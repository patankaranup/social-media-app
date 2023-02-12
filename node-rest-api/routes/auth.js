const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// REGISETER THE USER 
router.post('/register',async (req,res)=>{
    try {
        // generate a hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        // create a new user
        const newUser = await new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        })
        // save a new user and return response
       const user = await newUser.save();
       res.status(200).send(user);
    } catch (error) {
        console.log(error);
    }
})

// USER LOGIN
router.post('/login', async (req,res)=>{
    try {
        // find user by email address
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).json("user not found");
        } else{
            // validate password
            const validPassword = await bcrypt.compare(req.body.password,user.password);
            if(!validPassword){
                res.status(400).json("Wrong Password")
            } else{
                res.status(200).json(user);
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
    
})



module.exports = router;