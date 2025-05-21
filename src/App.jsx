import { useEffect } from "react"
import { adminStore } from "./api/Admin"
import { studentStore } from "./api/Student"
import AdminLogin from "./components/Admin/AdminLogin"
import HomeAdimpage from "./components/Admin/HomeAdimpage"
import Book from "./components/Admin/Managerment/Book"
import Card from "./components/Admin/Managerment/Card"
import Student from "./components/Admin/Managerment/Student"
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute"
import Footerpage from "./components/Footerpage"
import HeaderPage from "./components/HeaderPage"
import Home from "./components/Home"
import HomeStudentPage from "./components/Student/HomeStudentPage"
import Login from "./components/Student/Login"
import { Route, Routes } from 'react-router-dom'
import Docket from "./components/Admin/Managerment/Docket"
import { axiosInstance } from "./lib/axios"

function App() {
  const { checkAdminAuth, isCheckAdminAuth } = adminStore()
  const { checkStudentAuth, isCheckStudentAuth } = studentStore()

  useEffect(() => {
    if (isCheckAdminAuth) checkAdminAuth()
    if (isCheckStudentAuth) checkStudentAuth()
  }, [checkAdminAuth, checkStudentAuth, isCheckAdminAuth, isCheckStudentAuth])

  if(isCheckAdminAuth || isCheckStudentAuth){
    return <div className="text-center p-8">Đang kiểm tra xác thực ...</div>
  }

  useEffect(() => {
    axiosInstance.get('/api/test')
      .then(res => console.log('🔥 Test request success:', res.data))
      .catch(err => console.error('🔥 Test request error:', err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderPage/>

      <Routes>
        <Route path='/' element = { <Home/>}/>

        <Route path='/login' element = { <Login/>}/>
        <Route path='/student/home' element = { <HomeStudentPage/>}/>

        <Route path='admin/login' element = { <AdminLogin/>}/>
        <Route path='admin/home' 
          element = { 
            <ProtectedAdminRoute>
              <HomeAdimpage/>
            </ProtectedAdminRoute>
          }
        />

        <Route path='admin/home/managermentStudent' 
          element = { 
            <ProtectedAdminRoute>
              <Student/>
            </ProtectedAdminRoute>
          }
        />

        <Route path='admin/home/managermentBook' 
          element = { 
            <ProtectedAdminRoute>
              <Book/>
            </ProtectedAdminRoute>
          }
        />

        <Route path='admin/home/managermentCard' 
          element = { 
            <ProtectedAdminRoute>
              <Card/>
            </ProtectedAdminRoute>
          }
        />

        <Route path='admin/home/managermentDocket' 
          element = { 
            <ProtectedAdminRoute>
              <Docket/>
            </ProtectedAdminRoute>
          }
        />

      </Routes>
      <Footerpage/>
    </div>
  )
}

export default App
