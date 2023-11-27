import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    isError: false,
    errMsg: '',
  }

  onChangeUserInput = event => {
    this.setState({username: event.target.value})
  }

  onChangePasswordInput = event => {
    this.setState({password: event.target.value})
  }

  renderSuccessResponse = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    })
    history.replace('/')
    this.setState({username: '', password: '', isError: false, errMsg: ''})
  }

  renderFailureResponse = errorMsg => {
    this.setState({isError: true, errMsg: errorMsg})
  }

  onSubmitFormCard = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {
      username,
      password,
    }
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.renderSuccessResponse(data.jwt_token)
    } else {
      this.renderFailureResponse(data.error_msg)
    }
  }

  renderLoginForm = () => {
    const {username, password, isError, errMsg} = this.state

    return (
      <form className="login-form-card" onSubmit={this.onSubmitFormCard}>
        <div className="login-logo-card">
          <img
            src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675321631/samples/InstaShare%20PNG/Standard_Collection_8_pyny2p.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="login-logo-title">Insta Share</h1>
        </div>
        <label className="label-heading" htmlFor="usernameId">
          USERNAME
        </label>
        <input
          className="inputForm"
          placeholder="USERNAME"
          id="usernameId"
          type="text"
          value={username}
          onChange={this.onChangeUserInput}
        />
        <label className="label-heading" htmlFor="passwordId">
          PASSWORD
        </label>
        <input
          className="inputForm"
          placeholder="PASSWORD"
          id="passwordId"
          type="password"
          value={password}
          onChange={this.onChangePasswordInput}
        />
        {isError ? <p className="error-msg">{errMsg}</p> : ''}
        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
    )
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-form-bg">
        <img
          src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675321632/samples/InstaShare%20PNG/OBJECTS_pb0bk9.png"
          className="login-form-img"
          alt="website login"
        />
        {this.renderLoginForm()}
      </div>
    )
  }
}

export default LoginForm
