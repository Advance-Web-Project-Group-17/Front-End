import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
    const isLoggedIn = sessionStorage.getItem("isLoggedIn")
  return isLoggedIn ? <Outlet /> : <Navigate to={"/login"} />
}

export default ProtectedRoute
