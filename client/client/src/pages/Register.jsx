import React, { useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { request } from '../api'

import Toast from '../components/Toast'
import './Login.css'
const API_URL = import.meta.env.VITE_API_URL;

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.password) errs.password = 'Password required'
    else if (form.password.length < 6) errs.password = 'Min 6 characters'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) return
    try {
      await request(`${API_URL}/api/auth/register`, { method: 'POST', body: form })
      setToast({ type: 'success', message: 'Registered successfully!' })
      setTimeout(() => navigate('/login'), 1000)
    } catch {
      setToast({ type: 'error', message: 'Registration failed' })
    }
  }

  return (
    <div className="loginBg">
     <div className="loginCard">
           <h1 className='loginH1 ' >Simple<span className='spanH1'>Hunt</span></h1>
          <form onSubmit={handleSubmit} className='formContainer'>
              <div className='labelInput' >
               <label htmlFor="name" className='cardLabel'>Name:</label>
              <input   id='name' type="text" placeholder='Enter Name' className='inputBox'
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
             <div className='labelInput' >
               <label htmlFor="email" className='cardLabel'>Email:</label>
              <input   id='email' type="email" placeholder='Enter Email' className='inputBox'
               value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className='labelInput'>
                <label className='cardLabel' htmlFor="password">Password:</label>
              <input  type="password" placeholder='Enter Password' className='inputBox'
               value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} error={errors.password} />
            </div>
             <button type='submit' className='loginBtn' >Register</button>
             
          </form>
       </div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
         <Link to='/login' className='links'>Login</Link>
    </div>
  )
}
