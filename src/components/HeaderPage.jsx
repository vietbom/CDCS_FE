import React from 'react'
import { Home } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { studentStore } from '../api/Student'
import { adminStore } from '../api/Admin'

const HeaderPage = () => {
    const navigate = useNavigate()

    const authUser = studentStore(state => state.authUser)
    const logoutStudent = studentStore(state => state.logout)

    const authAdmin = adminStore(state => state.authAdmin)
    const adminLogout = adminStore(state => state.adminLogout)

    const handleLogout = async () => {
        if (authUser) {
            await logoutStudent()
            navigate('/login')
        } else if (authAdmin) {
            await adminLogout()
            navigate('/admin/login')
        }
    }

    const handleLogin = () => navigate('/login')

    return (
        <header className='sticky top-0 z-40 bg-white shadow-sm'>
            <div className='w-full bg-green-300'>
                <div className='container mx-auto flex items-center justify-between h-16 px-4 md:px-6'>
                    <div className='flex items-center'>
                        <Link to='/' className='flex items-center mr-3'>
                            <Home className='text-green-900' />
                        </Link>
                        <span className='text-green-900 text-xl font-bold'>Hệ thống thư viện</span>
                    </div>

                    {(authUser || authAdmin) ? (
                        <div className='flex items-center gap-3'>
                            <span className="text-sm text-green-900 font-medium cursor-pointer hover:underline"
                                onClick={()=>{
                                    if(authAdmin) {
                                        navigate('/admin/home')
                                    }else if(authUser){
                                        navigate('/student/home')
                                    }
                                }}
                            >
                                Chào, {authUser ? authUser.userName : authAdmin.userName}
                            </span>
                            <button onClick={handleLogout} className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-xs font-medium">
                                Đăng xuất
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogin} className="px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                            Đăng nhập
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}

export default HeaderPage
