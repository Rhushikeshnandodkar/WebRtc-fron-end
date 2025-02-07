import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
function Navbar() {
    const navigate = useNavigate()
    const goToHome = () =>{
        navigate('/')
    }
  return (
    <>
    <div>Navbar Section</div>
    <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <button onClick={goToHome}>Go Home</button>
    </ul>
    </>
  )
}

export default Navbar