import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'
import LoadingSpinner from '../components/LoadingSpinner'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const handleLogin = () => {
    if (!email || !password) {
      alert('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      navigate('/')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col p-5">
        <div className="flex flex-col items-center mt-10 mb-10">
          <Logo size="large" animated={true} />
          <p className="text-sm text-gray mt-2">AI-Powered Golf Swing Analysis</p>
        </div>
        
        <div className="card mb-6 hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-bold text-text mb-1">Welcome Back</h2>
          <p className="text-sm text-gray mb-6">Sign in to continue</p>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={20} className="text-gray" />
            </div>
            <input
              type="email"
              className="bg-lightGray w-full pl-10 pr-3 py-3 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="bg-lightGray w-full pl-10 pr-10 py-3 rounded-xl text-text focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button 
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} className="text-gray" />
              ) : (
                <Eye size={20} className="text-gray" />
              )}
            </button>
          </div>
          
          <div className="flex justify-end mb-6">
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Forgot Password?
            </button>
          </div>
          
          <button 
            className={`w-full flex items-center justify-center py-3 rounded-full font-semibold text-white mb-6 transition-colors ${isLoading ? 'bg-gray' : 'bg-primary hover:bg-primary/90'}`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <LoadingSpinner color="white" size={20} />
                <span className="ml-2">Signing in...</span>
              </div>
            ) : (
              <>
                <span className="mr-2">Sign In</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
          
          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-lightGray"></div>
            <span className="px-3 text-sm text-gray font-medium">OR</span>
            <div className="flex-1 h-px bg-lightGray"></div>
          </div>
          
          <div className="flex space-x-4">
            <button className="flex-1 flex items-center justify-center py-3 border border-lightGray rounded-xl hover:bg-lightGray/50 transition-colors">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium text-text">Google</span>
            </button>
            
            <button className="flex-1 flex items-center justify-center py-3 border border-lightGray rounded-xl hover:bg-lightGray/50 transition-colors">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
                alt="Apple"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium text-text">Apple</span>
            </button>
          </div>
        </div>
        
        <div className="flex justify-center items-center">
          <span className="text-sm text-gray mr-1">Don't have an account?</span>
          <button className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login