import React, { useState } from 'react'
import { useNavigate ,Link} from 'react-router-dom'
import { request } from '../api' 
import Input from '../components/Input' 
import Button from '../components/Button' 
import Card from '../components/Card' 
import Toast from '../components/Toast' 
import './Login.css' 
const API_URL = import.meta.env.VITE_API_URL; 
export default function Login() {
  const [email, setEmail] = useState('') 
  const [password, setPassword] = useState('') 
  const [errors, setErrors] = useState({}) 
  const [toast, setToast] = useState(null) 
  const navigate = useNavigate() 
  const validate = () => {
    const newErrors = {}
      if (!email) newErrors.email = 'Email required'
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email' 
          if (!password) newErrors.password = 'Password required' 
            return newErrors } 
    const handleSubmit = async (e) => { e.preventDefault() const newErrors = validate() setErrors(newErrors) if (Object.keys(newErrors).length) return try { const data = await request(${API_URL}/api/auth/login, { method: 'POST', body: { email, password } }) localStorage.setItem('token', data.token) localStorage.setItem('user', JSON.stringify(data.user)) setToast({ type: 'success', message: 'Login successful!' }) setTimeout(() => navigate('/home'), 1000) } catch { setToast({ type: 'error', message: 'Invalid credentials' }) } } return ( <div className='loginBg'> <div className="loginCard"> <h1 className='loginH1 ' >Simple<span className='spanH1'>Hunt</span></h1> <form onSubmit={handleSubmit} className='formContainer'> <div className='labelInput' > <label htmlFor="username" className='cardLabel'>Email:</label> <input id='username' type="email" placeholder='Enter Username' className='inputBox' onChange={(e)=>setEmail(e.target.value)} /> </div> <div className='labelInput'> <label className='cardLabel' htmlFor="password">Password:</label> <input type="password" placeholder='Enter Password' className='inputBox' onChange={(e)=>setPassword(e.target.value)} /> </div> <button type='submit' className='loginBtn' >Login</button> {toast && <Toast {...toast} onClose={() => setToast(null)} />} </form> </div> <Link to='/register' className="links">Click here for Register</Link> </div> ) }
