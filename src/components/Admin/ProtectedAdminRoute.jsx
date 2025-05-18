import React from 'react'
import { Navigate } from 'react-router-dom'
import { adminStore } from '../../api/Admin'

const ProtectedAdminRoute = ({ children }) => {
  const authAdmin = adminStore(state => state.authAdmin)

  if (!authAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedAdminRoute
