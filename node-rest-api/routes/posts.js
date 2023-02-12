const router = require('express').Router();
const Post  = require('../models/Post');
const User = require('../models/User');
// create a post
router.post('/', async(req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
})

// update a post
router.put('/:id', async(req,res)=>{
    try {
        // find post by parameter id
        const post = await Post.findById(req.params.id);
        // check whether the post owner and the other owner is the same 
        if(post.userId === req.body.userId){
            // update the post with body content
            await post.updateOne({$set:req.body});
            res.status(200).json("The post has been updated")
        } else {
            res.status(403).json("You can update only your post")
        }

    } catch (error) {
        res.status(500).json(error);
    }
    
})


// delete a post
router.delete('/:id', async(req,res)=>{
    try {
        // find post by parameter id
        const post = await Post.findById(req.params.id);
        // check whether the post owner and the current owner is the same 
        if(post.userId === req.body.userId){
            // delete the post 
            await post.deleteOne();
            res.status(200).json("The post has been deleted")
        } else {
            res.status(403).json("You can delete only your post")
        }
    } catch (error) {
        res.status(500).json(error);
    }
    
})


// like or dislike a post
router.put('/:id/like', async (req,res)=>{
    try {
        // find the post by params req id
        const post = await Post.findById(req.params.id);
        // if the user is not in the like arrays add him
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The post has been liked");
        } else { 
            // else remove the user from the likes array 
            await post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The post has been disliked");
        }

    } catch (error) {
        res.status(500).json(error);
    }

    
})
// get a post
router.get('/:id', async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);

    } catch (error) {
        res.status(500).json(error);
    }
})

// get timeline posts post of the following of the users
router.get('/timeline/all', async(req,res)=>{
    try {
        // find who is the current user
        const currentUser = await User.findById(req.body.userId);
        // find the posts of the current user
        const currentUserPosts = await Post.find({userId:currentUser._id});
        // find the posts of the current users following 
        const friendsPosts = await Promise.all(
            // map over his followings and find the id 
            currentUser.followings.map((friendsId)=>{
                // find the post by the id
                return Post.find({userId:friendsId});
            })
        );
        res.status(200).json(currentUserPosts.concat(...friendsPosts));

    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;