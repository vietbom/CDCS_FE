import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserIcon, BookIcon, CreditCardIcon, ClipboardListIcon } from 'lucide-react'
import { studentStore } from '../../api/Student'

const HomeAdimpage = () => {
  const { authuser } = studentStore()

  if (authuser) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="space-y-4 w-full max-w-md px-4">
        <Link
          to="/admin/home/managermentStudent"
          className="w-full flex items-center gap-4 px-6 py-4 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
        >
          <UserIcon className="w-6 h-6" />
          Quản Lý Sinh Viên
        </Link>
        <Link
          to="/admin/home/managermentBook"
          className="w-full flex items-center gap-4 px-6 py-4 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
        >
          <BookIcon className="w-6 h-6" />
          Quản Lý Sách
        </Link>
        <Link
          to="/admin/home/managermentCard"
          className="w-full flex items-center gap-4 px-6 py-4 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
        >
          <CreditCardIcon className="w-6 h-6" />
          Quản Lý Thẻ Thư Viện
        </Link>
        <Link
          to="/admin/home/managermentDocket"
          className="w-full flex items-center gap-4 px-6 py-4 bg-gray-200 rounded-lg font-bold text-gray-700 hover:bg-gray-300 transition"
        >
          <ClipboardListIcon className="w-6 h-6" />
          Quản Lý Mượn Trả Sách
        </Link>
      </div>
    </div>
  )
}

export default HomeAdimpage
