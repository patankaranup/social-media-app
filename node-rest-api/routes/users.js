const router = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
// update user 
router.put('/:id', async (req,res)=>{
    // checks whether the id inside body is equal to the prameters id or the user is admin
    if(req.body.userId===req.params.id || req.body.isAdmin){
        // update a password if body is having a password key
        if(req.body.password){
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            } catch (error) {
                return res.status(500).json(error);
            } 
        }
        try {
            // find the user by his id and set all values of all content of body to the new content 
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json("Account updated")
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can update only your account")
    }
})
// delete user 
router.delete('/:id', async (req,res)=>{
    // checks whether the id inside body is equal to the prameters id or the user is admin
    if(req.body.userId===req.params.id || req.body.isAdmin){
        try {
            // find the user by his id and set all values of all content of body to the new content 
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted successfully")
        } catch (error) {
            return res.status(500).json(error);
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})
// get user 
router.get('/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        // does not includes password and updatedat keys in the other
        const {password, updatedAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (error) {
        res.status(500).json(error);
    }
})
// follow a user 
router.put("/:id/follow",async(req,res)=>{
    // get the current userid and the other user id to be followed and check whether they are different and then only follow a user
    if(req.body.userId !== req.params.id){
        try {
            // get the other user to be followed 
            const user = await User.findById(req.params.id);
            // get the current user 
            const currentUser = await User.findById(req.body.userId);
            // check whether the current user already follows him or not
            if(!user.followers.includes(req.body.userId)){
                // update the users followers array actually push the new user id
                await user.updateOne({$push:{followers:req.body.userId}});
                // updates the current users followings list
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("You started following this user");
            }else{
                res.status(403).json("You already follow this User");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You can't follow yourself");
    }
})

// unfollow a user
router.put("/:id/unfollow",async(req,res)=>{
    // get the current userid and the other user id to be followed and check whether they are different or not then only follow a user
    if(req.body.userId !== req.params.id){
        try {
            // get the other user to be followed 
            const user = await User.findById(req.params.id);
            // get the current user 
            const currentUser = await User.findById(req.body.userId);
            // check whether the current user follows him or not
            if(user.followers.includes(req.body.userId)){
                // update the users followers array actually pull the new user id means remove all instance of the value in the array
                await user.updateOne({$pull:{followers:req.body.userId}});
                // updates the current users followings list
                await currentUser.updateOne({$pull:{followings:req.params.id}});
                res.status(200).json("User has been unfollowed");
            }else{
                res.status(403).json("You don't follow this User");
            }
        } catch (error) {
            res.status(500).json(error);
        }
    }else{
        res.status(403).json("You can't unfollow yourself");
    }
})

module.exports = router;