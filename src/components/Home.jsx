import React from 'react'
import { Users, Search, BookOpen, LayoutGrid, Calendar, BarChart3 } from "lucide-react";

const Home = () => {
  return (
    <section className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                    Các chức năng chính của hệ thống
                </h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Hệ thống cung cấp đầy đủ các công cụ cần thiết để vận hành thư viện trường học một cách hiệu quả.
                </p>
                </div>
            </div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-emerald-100 p-3">
                        <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold">Đăng ký và đăng nhập</h3>
                    <p className="text-center text-gray-500">
                        Hỗ trợ người dùng đăng ký tài khoản và đăng nhập để sử dụng các chức năng của hệ thống.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-emerald-100 p-3">
                        <Search className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold">Tra cứu sách</h3>
                    <p className="text-center text-gray-500">
                        Sinh viên có thể dễ dàng tìm kiếm sách theo tên sách hoặc tác giả.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-emerald-100 p-3">
                        <BookOpen className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold">Theo dõi sách mượn</h3>
                    <p className="text-center text-gray-500">
                        Hiển thị thông tin sách đang mượn giúp sinh viên theo dõi thông tin mượn-trả sách.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-emerald-100 p-3">
                        <Users className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold">Quản lý sinh viên</h3>
                    <p className="text-center text-gray-500">
                        Thủ thư có thể thêm, sửa, xóa thông tin của sinh viên trong hệ thống.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-emerald-100 p-3">
                        <LayoutGrid className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold">Quản lý sách</h3>
                    <p className="text-center text-gray-500">
                        Thủ thư có thể cập nhật, chỉnh sửa hoặc xóa thông tin sách trong cơ sở dữ liệu.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                    <div className="rounded-full bg-emerald-100 p-3">
                        <Calendar className="h-6 w-6 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold">Quản lý mượn-trả</h3>
                    <p className="text-center text-gray-500">
                        Thủ thư quản lý yêu cầu mượn-trả sách, xác nhận mượn/trả và tạo phiếu mượn sách.
                    </p>
                </div>
            </div>
        </div>
    </section>
  )
}

export default Home

