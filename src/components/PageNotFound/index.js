import {Link} from 'react-router-dom'
import './index.css'

const PageNotFound = () => (
  <div className="page-not-found-container">
    <img
      src="https://res.cloudinary.com/dgbrmgffm/image/upload/v1675687140/samples/InstaShare%20PNG/erroring_1_g3gp8t.png"
      alt="page not found"
      className="page-not-found-img"
    />
    <h1 className="page-not-found-title">PAGE NOT FOUND</h1>
    <p className="page-not-found-description">
      We are sorry, the page you requested could not be found.
    </p>
    <p className="page-not-found-description">
      Please go back to the homepage.
    </p>
    <Link to="/">
      <button type="button" className="home-page-btn">
        Home Page
      </button>
    </Link>
  </div>
)

export default PageNotFound
