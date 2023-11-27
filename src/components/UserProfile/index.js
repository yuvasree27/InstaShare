import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import './index.css'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'

import Header from '../Header'
import UserPostItem from '../UserPostItem'

import PostItemDetails from '../PostItemDetails'

const status = {
  initial: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class UserProfile extends Component {
  state = {
    myProfile: {},
    storyList: [],
    postList: [],
    userProfileStatus: status.initial,
    caption: '',
    searchStatus: status.initial,
    isSearched: false,
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  checkCaption = () => {
    const {caption} = this.state
    if (caption.length === 0) {
      this.setState({isSearched: false})
    }
  }

  getProfileDetails = async () => {
    this.setState({userProfileStatus: status.initial})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()

      const updatedProfileDetails = {
        id: data.user_details.id,
        userID: data.user_details.user_id,
        userName: data.user_details.user_name,
        profilePic: data.user_details.profile_pic,
        followersCount: data.user_details.followers_count,
        followingCount: data.user_details.following_count,
        userBio: data.user_details.user_bio,
        postsCount: data.user_details.posts_count,
        stories: data.user_details.stories,
      }
      const updatedStoryList = data.user_details.stories
      const updatedPostList = data.user_details.posts
      this.setState({
        myProfile: updatedProfileDetails,
        storyList: updatedStoryList,
        postList: updatedPostList,
        userProfileStatus: status.success,
      })
    } else {
      this.setState({userProfileStatus: status.failed})
    }
  }

  renderProfileDetails = () => {
    const {myProfile} = this.state
    const {
      userName,
      profilePic,
      followersCount,
      followingCount,
      userBio,
      postsCount,
      userID,
    } = myProfile
    return (
      <div className="user-profile-details-container">
        <img src={profilePic} alt="user profile" className="user-profile-pic" />
        <div className="user-profile-details-card">
          <h1 className="profile-user-name">{userName}</h1>
          <div className="user-count-card">
            <p className="user-count-details">
              <span className="count">{postsCount}</span>posts
            </p>
            <p className="user-count-details">
              <span className="count">{followersCount}</span>followers
            </p>
            <p className="user-count-details">
              <span className="count">{followingCount}</span>following
            </p>
          </div>
          <p className="user-name-bio">{userID}</p>
          <p className="user-bio">{userBio}</p>
        </div>
      </div>
    )
  }

  renderStoryDetails = () => {
    const {storyList} = this.state

    return (
      <ul className="user-story-container">
        {storyList.map(each => (
          <li key={each.id} className="user-story-card">
            <img src={each.image} alt="user story" className="user-story" />
          </li>
        ))}
      </ul>
    )
  }

  renderPostItem = () => {
    const {postList} = this.state

    return (
      <>
        <div className="post-card">
          <BsGrid3X3 className="post-card-icon" />
          <h1 className="posts-title">Posts</h1>
        </div>
        {postList.length > 0 ? (
          <ul className="post-item-container">
            {postList.map(each => (
              <UserPostItem key={each.id} postItem={each} route="user" />
            ))}
          </ul>
        ) : (
          <div className="user-no-post-container">
            <div className="user-no-post-card">
              <div className="no-post-icon-card">
                <BiCamera className="no-post-icon" />
              </div>
              <h1 className="user-No-post-msg">No Posts</h1>
            </div>
          </div>
        )}
      </>
    )
  }

  renderLoadingView = () => (
    // eslint-disable-next-line react/no-unknown-property
    <div className="user-profile-loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderUserProfile = () => (
    <>
      {this.renderProfileDetails()}
      {this.renderStoryDetails()}
      <hr className="user-profile-line" />
      {this.renderPostItem()}
    </>
  )

  onClickedTryAgain = () => {
    this.getProfileDetails()
  }

  renderFailedView = () => (
    <div className="user-profile-failure-container">
      <div className="user-profile-failure-card">
        <img
          src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675935116/samples/InstaShare%20PNG/Group_7522_expew0.png"
          alt="failure view"
          className="user-profile-failure-view-img"
        />
        <p className="user-profile-error-msg">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="user-profile-failure-btn"
          onClick={this.onClickedTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderProfileSection = () => {
    const {userProfileStatus} = this.state
    let userProfileMode

    switch (userProfileStatus) {
      case status.initial:
        userProfileMode = this.renderLoadingView()
        break
      case status.success:
        userProfileMode = this.renderUserProfile()
        break
      case status.failed:
        userProfileMode = this.renderFailedView()
        break
      default:
        break
    }
    return userProfileMode
  }

  getSearchPost = async () => {
    this.setState({searchStatus: status.initial, isSearched: true})
    const {caption} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/insta-share/posts?search=${caption}`
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)
    const data = await response.json()

    if (data.posts.length > 0) {
      const updatedUserPostDetails = data.posts.map(each => ({
        postId: each.post_id,
        userId: each.user_id,
        userName: each.user_name,
        profilePic: each.profile_pic,
        postDetails: {
          imageUrl: each.post_details.image_url,
          caption: each.post_details.caption,
        },
        likesCount: each.likes_count,
        comments: each.comments.map(eachItem => ({
          userName: eachItem.user_name,
          userID: eachItem.user_id,
          comment: eachItem.comment,
        })),
        createdAt: each.created_at,
      }))
      this.setState({
        searchPostList: updatedUserPostDetails,
        searchStatus: status.success,
      })
      this.checkCaption()
    } else {
      this.setState({searchStatus: status.failed})
    }
  }

  onClickedSearchBar = searchCaption => {
    this.setState({caption: searchCaption}, this.getSearchPost)
  }

  onChangeSearchStatus = value => {
    if (value === '') {
      this.setState({isSearched: false})
    }
  }

  renderLoading = () => {
    const {isSearched} = this.state
    return (
      <div
        className={
          isSearched ? 'loader-container post-section' : 'loader-container'
        }
        // eslint-disable-next-line react/no-unknown-property
        testid="loader"
      >
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    )
  }

  renderSearchFailureView = () => (
    <div className="search-failure-container">
      <img
        src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675865026/samples/InstaShare%20PNG/Group_udoax3.png"
        alt="search not found"
        className="search-failure-view-img"
      />
      <p className="search-error-title">Search Not Found</p>
      <p className="search-error-text">Try different keyword or search again</p>
    </div>
  )

  renderSearchCaption = () => {
    const {searchPostList} = this.state

    return (
      <>
        <h1 className="search-heading">Search Results</h1>
        <div className="search-card-container">
          <ul className="post-list-container">
            {searchPostList.map(eachItem => (
              <PostItemDetails postItem={eachItem} key={eachItem.postId} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderSearchSection = () => {
    const {searchStatus} = this.state
    let searchMode

    switch (searchStatus) {
      case status.initial:
        searchMode = this.renderLoading()
        break
      case status.success:
        searchMode = this.renderSearchCaption()
        break
      case status.failed:
        searchMode = this.renderSearchFailureView()
        break
      default:
        break
    }
    return searchMode
  }

  render() {
    const {isSearched} = this.state
    return (
      <div className="user-profilePage-container">
        <Header
          onClickedSearchBar={this.onClickedSearchBar}
          onChangeSearchStatus={this.onChangeSearchStatus}
        />
        <div className="user-profile-section-container">
          <div className="user-profile-content-container">
            {isSearched === false
              ? this.renderProfileSection()
              : this.renderSearchSection()}
          </div>
        </div>
      </div>
    )
  }
}
export default UserProfile