import './post.css'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {Users} from '../../dummyData'
import { useState } from 'react';

const Post = ({post}) => {
    const [like, setLike] = useState(post.like)
    const [isliked, setIsliked] = useState(false)

    const likeHandler = () => {
        setLike(isliked ? like-1:like+1 )
        setIsliked(!isliked)
    }   

  return (
    <div className='post'>
        <div className="postWrapper">
            <div className="postTop">
                <div className="postTopLeft">
                    <img src={Users.filter((u)=>u.id === post.userId)[0].profilePicture} alt="" className="postProfileImg" />
                    <span className="postUsername">
                    {Users.filter((u)=>u.id === post.userId)[0].username}
                    </span>
                    <span className="postDate">{post.date}</span>
                </div>
                <div className="postTopRight">
                    <MoreVertIcon/>
                </div>
            </div>
            <div className="postCenter">
                <span className="postText">{post?.desc}</span>
                <img src={post.photo} alt="" className="postImg" />
            </div>
            <div className="postBottom">
                <div className="postBottomLeft">
                    <img className='likeIcon' src="/assets/like.png" alt="" onClick={likeHandler}/>
                    <img className='likeIcon' src="/assets/heart.png" alt="" onClick={likeHandler}/>
                    <span className="postLikeCounter">{like} people like it</span>
                </div>
                <div className="postBottomRight">
                    <span className="postCommentText">{post.comment} comments</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Post