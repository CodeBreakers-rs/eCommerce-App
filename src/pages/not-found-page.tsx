import { Link } from 'react-router-dom'
import NotFoundImage from '../assets/images/error-404-2.png'

const NotFoundPage = () => (
  <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
    <img
      src={NotFoundImage}
      alt="Page not found"
      className="max-w-xs md:max-w-md mb-8"
    />
    <h1 className="text-3xl font-bold mb-4 text-yellow-600">
      404 - Page Not Found
    </h1>
    <p className="text-lg text-gray-600 mb-6">
      Oops! The page you're looking for doesn’t exist or has been moved.
    </p>
    <Link to="/">
      <button>Return to the Main page</button>
    </Link>
  </section>
)

export default NotFoundPage
