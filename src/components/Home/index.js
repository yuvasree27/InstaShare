import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

import Loader from 'react-loader-spinner'

import Header from '../Header'
import ReactSlick from '../ReactSlick'
import PostItemDetails from '../PostItemDetails'

const status = {
  initial: 'LOADING',
  success: 'SUCCESS',
  failed: 'FAILED',
}

class Home extends Component {
  state = {
    userPostArray: [],
    userStoryArray: [],
    caption: '',
    searchPostList: [],
    storyStatus: status.initial,
    postStatus: status.initial,
    searchStatus: status.initial,
    isSearched: false,
  }

  componentDidMount() {
    this.getInstaShareStories()
    this.getInstaSharePosts()
  }

  checkCaption = () => {
    const {caption} = this.state
    if (caption.length === 0) {
      this.setState({isSearched: false})
    }
  }

  onChangeSearchStatus = value => {
    if (value === '') {
      this.setState({isSearched: false})
    }
  }

  getInstaShareStories = async () => {
    this.setState({storyStatus: status.initial})
    const url = 'https://apis.ccbp.in/insta-share/stories'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
      const updatedStoryStatus = data.users_stories.map(each => ({
        storyUrl: each.story_url,
        userID: each.user_id,
        userName: each.user_name,
      }))
      this.setState({
        storyStatus: status.success,
        userStoryArray: updatedStoryStatus,
      })
    } else {
      this.setState({storyStatus: status.failed})
    }
  }

  getInstaSharePosts = async () => {
    this.setState({postStatus: status.initial})
    const url = 'https://apis.ccbp.in/insta-share/posts'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    const response = await fetch(url, options)

    if (response.ok === true) {
      const data = await response.json()
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
        userPostArray: updatedUserPostDetails,
        postStatus: status.success,
      })
    } else {
      this.setState({postStatus: status.failed})
    }
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

    if (response.ok) {
      const data = await response.json()
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

  renderLoading = () => {
    const {isSearched} = this.state
    return (
      <div
        className={
          isSearched ? 'loader-container post-section' : 'loader-container'
        }
        testid="loader"
      >
        <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
      </div>
    )
  }

  renderStoryLoading = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderStory = () => {
    const {userStoryArray} = this.state

    return <ReactSlick userStoryArray={userStoryArray} />
  }

  renderPost = () => {
    const {userPostArray} = this.state

    return (
      <ul className="post-list-container">
        {userPostArray.map(eachItem => (
          <PostItemDetails postItem={eachItem} key={eachItem.postId} />
        ))}
      </ul>
    )
  }

  renderSearchCaption = () => {
    const {searchPostList} = this.state

    return (
      <>
        {searchPostList.length > 0 ? (
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
        ) : (
          <div className="search-failure-container">
            <img
              src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675865026/samples/InstaShare%20PNG/Group_udoax3.png"
              alt="search not found"
              className="search-failure-view-img"
            />
            <h1 className="search-error-title">Search Not Found</h1>
            <p className="search-error-text">
              Try different keyword or search again
            </p>
          </div>
        )}
      </>
    )
  }

  onClickedPostTryAgain = () => {
    this.getInstaSharePosts()
  }

  onClickedStoryTryAgain = () => {
    this.getInstaShareStories()
  }

  onClickedSearchTryAgain = () => {
    this.getSearchPost()
  }

  renderPostFailureView = () => (
    <div className="home-failure-container">
      <img
        src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675777842/samples/InstaShare%20PNG/Icon_t6zrkg.png"
        alt="failure view"
        className="home-failure-view-img"
      />
      <p className="home-error-msg">Something went wrong. Please try again</p>
      <button
        type="button"
        className="home-failure-btn"
        onClick={this.onClickedPostTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderStoryFailureView = () => (
    <div className="home-failure-container">
      <img
        src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675777842/samples/InstaShare%20PNG/Icon_t6zrkg.png"
        alt="failure view"
        className="home-failure-view-img"
      />
      <p className="home-error-msg">Something went wrong. Please try again</p>
      <button
        type="button"
        className="home-failure-btn"
        onClick={this.onClickedStoryTryAgain}
      >
        Try again
      </button>
    </div>
  )

  renderSearchFailureView = () => (
    <div className="failure-bg">
      <div className="home-failure-container">
        <img
          src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675777842/samples/InstaShare%20PNG/Icon_t6zrkg.png"
          alt="failure view"
          className="home-failure-view-img"
        />
        <p className="home-error-msg">Something went wrong. Please try again</p>
        <button
          type="button"
          className="home-failure-btn"
          onClick={this.onClickedSearchTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderStorySection = () => {
    this.renderPostSection()
    const {storyStatus} = this.state
    let storyMode

    switch (storyStatus) {
      case status.initial:
        storyMode = this.renderStoryLoading()
        break
      case status.success:
        storyMode = this.renderStory()
        break
      case status.failed:
        storyMode = this.renderStoryFailureView()
        break
      default:
        break
    }
    return storyMode
  }

  renderPostSection = () => {
    const {postStatus} = this.state
    let postMode

    switch (postStatus) {
      case status.initial:
        postMode = this.renderLoading()
        break
      case status.success:
        postMode = this.renderPost()
        break
      case status.failed:
        postMode = this.renderPostFailureView()
        break
      default:
        break
    }
    return postMode
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
    const {searchCaption, isSearched} = this.state
    return (
      <div className="homePage-container">
        <Header
          searchCaption={searchCaption}
          onClickedSearchBar={this.onClickedSearchBar}
          onChangeSearchStatus={this.onChangeSearchStatus}
          selectedRoute={isSearched === false ? 'Home' : undefined}
        />
        <div className="home-post-container">
          <div className="home-content-container">
            {isSearched === false ? this.renderStorySection() : null}
            {isSearched === false ? (
              <div className="post-section">{this.renderPostSection()}</div>
            ) : (
              this.renderSearchSection()
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Home