import {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import {FaSearch} from 'react-icons/fa'

import RouteContext from '../../Context/RouteContext'

class Header extends Component {
  render() {
    const {onClickedSearchBar, onChangeSearchStatus, selectedRoute} = this.props
    return (
      <RouteContext.Consumer>
        {value => {
          const {onChangeSearchCaption, searchCaption} = value

          const onChangeSearchInput = event => {
            onChangeSearchCaption(event.target.value)
            onChangeSearchStatus(event.target.value)
          }

          const onClickedLogout = () => {
            Cookies.remove('jwt_token')
            const {history} = this.props
            history.replace('/login')
          }

          const onClickedSearchBtn = () => {
            onClickedSearchBar(searchCaption)
            onChangeSearchCaption('')
          }

          const onClickedEnterBtn = event => {
            if (event.key === 'Enter') {
              onClickedSearchBar(searchCaption)
              onChangeSearchCaption('')
            }
          }

          return (
            <>
              <nav className="navbar-container">
                <div className="navbar-content">
                  <div className="navbar-logo-card">
                    <Link to="/">
                      <img
                        src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675321631/samples/InstaShare%20PNG/Standard_Collection_8_pyny2p.png"
                        alt="website logo"
                        className="navbar-website-logo"
                      />
                    </Link>
                    <h1 className="navbar-logo-title">Insta Share</h1>
                  </div>
                  <div className="navbar-content-card">
                    <div className="search-card">
                      <input
                        type="search"
                        className="search-bar"
                        placeholder="Search Caption"
                        value={searchCaption}
                        onChange={onChangeSearchInput}
                        onKeyDown={onClickedEnterBtn}
                      />
                      <button
                        type="button"
                        className="search-btn"
                        // eslint-disable-next-line react/no-unknown-property
                        testid="searchIcon"
                        onClick={onClickedSearchBtn}
                      >
                        <FaSearch size={16} />
                      </button>
                    </div>
                    <ul className="link-card">
                      <li>
                        <Link
                          to="/"
                          className={
                            selectedRoute === 'Home'
                              ? `nav-link selectedLink`
                              : 'nav-link'
                          }
                        >
                          Home
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/my-profile"
                          className={
                            selectedRoute === 'my-Profile'
                              ? `nav-link selectedLink`
                              : 'nav-link'
                          }
                        >
                          Profile
                        </Link>
                      </li>
                    </ul>
                    <button
                      type="button"
                      className="logout-btn"
                      onClick={onClickedLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </nav>
              <hr />
            </>
          )
        }}
      </RouteContext.Consumer>
    )
  }
}

export default withRouter(Header)