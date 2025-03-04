import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-5">
      <h1 className="text-3xl font-bold text-text mb-4">Oops!</h1>
      <p className="text-lg text-gray mb-8">This page doesn't exist.</p>
      <Link to="/" className="bg-primary text-white font-semibold px-6 py-3 rounded-full">
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound