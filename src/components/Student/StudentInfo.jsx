import React from 'react'
import { studentStore } from '../../api/Student'

const StudentInfo = () => {
  const { authUser } = studentStore()

  if (!authUser) {
    return (
      <div className="w-full md:w-1/3 p-4 border-r border-gray-200">
        <div className="text-gray-400 italic">Đang tải thông tin sinh viên...</div>
      </div>
    )
  }

  return (
    <div className="w-full md:w-1/3 p-4 border-r border-gray-200">
      <div className="bg-cyan-100 rounded-lg overflow-hidden">
        <div className="p-4 bg-cyan-500 text-white text-center">
          <h2 className="text-lg font-medium">Thông Tin Sinh Viên</h2>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex">
            <div className="w-1/3 font-medium">Mã SV:</div>
            <div className="w-2/3 text-gray-400">{authUser.MaSV}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Họ và Tên:</div>
            <div className="w-2/3 text-gray-400">{authUser.userName}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Email:</div>
            <div className="w-2/3 text-gray-400">{authUser.email}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Lớp:</div>
            <div className="w-2/3 text-gray-400">{authUser.classroom}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 font-medium">Số điện thoại: </div>
            <div className="w-2/3 text-gray-400">{authUser.SDT}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentInfo
