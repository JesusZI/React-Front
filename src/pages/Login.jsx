import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setAuth } from '../store/slices/authSlice'

export default function Login(){
  const [email, setEmail] = useState('carlospea13+1@gmail.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState({})
  const [remember, setRemember] = useState(true)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const setFriendlyError = (msg, status) => {
    const code = status ? `(${status}) ` : ''
    setError(`${code}${msg}`)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setErrors({})

    if (!email && !password) {
      setErrors({ email: 'Email is required', password: 'Password is required' })
      setError('Please enter your email and password.')
      if (emailRef.current) emailRef.current.focus()
      return
    }
    if (!email) {
      setErrors({ email: 'Email or username is required' })
      setError('Please enter your email.')
      if (emailRef.current) emailRef.current.focus()
      return
    }
    if (!password) {
      setErrors({ password: 'Password is required' })
      setError('Please enter your password.')
      if (passwordRef.current) passwordRef.current.focus()
      return
    }
    try{
      const res = await axios.post('https://api.qa.myintelli.net/v1/login',{ email, password })
      const data = res.data
      const token = data?.token || data?.access_token || data?.data?.token
      const modules = data?.modules || data?.data?.modules || []
      if(token){
        try{ localStorage.setItem('rawModules', JSON.stringify(modules)) }catch(e){ }
        dispatch(setAuth({ token, modules }))
        navigate('/welcome')
      } else {
        const msg = data?.message || data?.error || 'Login failed: no token returned'
        const status = res?.status
        setFriendlyError(typeof msg === 'string' ? msg : 'Login failed', status)
      }
    }catch(err){
      const status = err.response?.status
      const dataErr = err.response?.data

   
      if (status === 401) {
        setErrors({})
        setFriendlyError('Invalid credentials. Please check your email and password.', status)
        return
      }

    
      if (dataErr && (dataErr.errors || dataErr.error || dataErr.message)) {
       
        if (dataErr.errors && typeof dataErr.errors === 'object') {
        
          const fieldErrors = {}
          Object.keys(dataErr.errors).forEach(k => {
            const v = dataErr.errors[k]
            if (Array.isArray(v)) fieldErrors[k] = v.join(' ')
            else if (typeof v === 'string') fieldErrors[k] = v
          })
          setErrors(fieldErrors)
          setError('Please fix the highlighted fields.')
          return
        }

      
        if (dataErr.message && typeof dataErr.message === 'string') {
        
          if (status === 401) setFriendlyError('Invalid credentials. Please check your email and password.', status)
          else setFriendlyError(dataErr.message, status)
          return
        }

       
        if (dataErr.error) {
          if (typeof dataErr.error === 'string') setFriendlyError(dataErr.error, status)
          else setFriendlyError('Login failed', status)
          return
        }
      }

      
      if (status === 401) {
        setFriendlyError('Invalid credentials. Please check your email and password.', status)
        return
      }

     
      const fallback = err.response?.data || err.message || 'Login failed'
      setFriendlyError(typeof fallback === 'string' ? fallback : 'Login failed', status)
    }
  }

  return (
    <div className="authentication-wrapper authentication-cover">
    

      <div className="authentication-inner row m-0">
            <div className="d-none d-lg-flex col-lg-7 col-xl-8 align-items-center p-5">
          <div className="w-100 d-flex justify-content-center">
            <img
              src="/assets/img/illustrations/boy-with-rocket-light.png"
              className="img-fluid"
              alt="Login image"
              width="700"
              data-app-dark-img="illustrations/boy-with-rocket-dark.png"
              data-app-light-img="illustrations/boy-with-rocket-light.png"
            />
          </div>
        </div>

        <div className="d-flex col-12 col-lg-5 col-xl-4 align-items-center authentication-bg p-sm-12 p-6">
          <div className="w-px-400 mx-auto mt-sm-12 mt-8" style={{ width: '100%', maxWidth: 420 }}>
            <h4 className="mb-1">Welcome to Project React! 👋</h4>
            <p className="mb-6 text-muted">Please sign-in to your account and start the adventure</p>

            {error && <div className="alert alert-danger" role="alert">{error}</div>}

            <form id="formAuthentication" onSubmit={handleSubmit} className="mb-6">
              <div className="mb-3 form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  ref={emailRef}
                  id="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e=>{ setEmail(e.target.value); if(errors.email) setErrors(prev=>({ ...prev, email: null })) }}
                  autoFocus
                  aria-invalid={errors.email ? 'true' : 'false'}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3 form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  ref={passwordRef}
                  id="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  type="password"
                  placeholder="············"
                  value={password}
                  onChange={e=>{ setPassword(e.target.value); if(errors.password) setErrors(prev=>({ ...prev, password: null })) }}
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

             

              <button type="submit" className="btn btn-primary d-grid w-100 mb-3">Sign in</button>
            </form>

            

            

         
          </div>
        </div>
      </div>
    </div>
  )
}
