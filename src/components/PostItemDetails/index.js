import {Component} from 'react'
import './index.css'

import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'

import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

class PostItemDetails extends Component {
  state = {
    likeStatus: '',
    isLiked: false,
  }

  onClickedLikeBtn = async () => {
    const {isLiked} = this.state
    const {postItem} = this.props
    const {postId} = postItem
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jasonData = {like_status: !isLiked}

    const options = {
      method: 'POST',
      headers: {Authorization: `Bearer ${jwtToken}`},
      body: JSON.stringify(jasonData),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    this.setState({likeStatus: data.message, isLiked: jasonData.like_status})
  }

  render() {
    const {postItem} = this.props
    const {isLiked, likeStatus} = this.state

    // eslint-disable-next-line no-unneeded-ternary
    const postLiked = likeStatus === 'Post has been liked' ? true : false

    const {
      userId,
      userName,
      profilePic,
      postDetails,
      likesCount,
      comments,
      createdAt,
    } = postItem

    const likeCount = isLiked ? likesCount + 1 : likesCount

    const {imageUrl, caption} = postDetails
    return (
      <li className="post-item-details-card">
        <div className="username-profile-card">
          <div className="profile-pic-card">
            <img
              src={profilePic}
              alt="post author profile"
              className="user-profile"
            />
          </div>
          <Link to={`/users/${userId}`} className="post-link">
            <p className="user-name">{userName}</p>
          </Link>
        </div>
        <img src={imageUrl} alt="post" className="post-img" />
        <div className="like-comment-share-card">
          {postLiked ? (
            <button
              type="button"
              className="like-btn"
              testid="unLikeIcon"
              onClick={this.onClickedLikeBtn}
            >
              <FcLike className="icon" />
            </button>
          ) : (
            <button
              type="button"
              className="like-btn"
              testid="likeIcon"
              onClick={this.onClickedLikeBtn}
            >
              <BsHeart className="icon" />
            </button>
          )}
          <button type="button" className="like-btn" testid="commentIcon">
            <FaRegComment className="icon" />
          </button>

          <button type="button" className="like-btn" testid="shareIcon">
            <BiShareAlt className="icon" />
          </button>
        </div>
        <p className="likes-count">{`${likeCount} likes`}</p>
        <p className="caption">{caption}</p>
        <ul className="comment-list-container">
          {comments.map(eachItem => (
            <li className="comment-item" key={eachItem.userID}>
              <p className="comment">
                <span className="cmt-username">{eachItem.userName}</span>
                {eachItem.comment}
              </p>
            </li>
          ))}
        </ul>
        <p className="post-duration">{createdAt}</p>
      </li>
    )
  }
}

export default PostItemDetails
