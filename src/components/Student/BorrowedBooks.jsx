import React, { useEffect } from 'react'
import { studentStore } from '../../api/Student'
import { useDocketStore } from '../../api/Docket'

const BorrowedBooks = () => {
  const { authUser } = studentStore()
  const { dockets, getBorrowedBooks } = useDocketStore()

  useEffect(() => {
    if (authUser?.MaSV) {
      getBorrowedBooks(authUser.MaSV)
    }
  }, [authUser, getBorrowedBooks])

  const calculateOverdueDays = (ngayHenTra, ngayTra) => {
    if (ngayTra) return 0
    const dueDate = new Date(ngayHenTra)
    const today = new Date()
    const diffTime = today.getTime() - dueDate.getTime()
    return diffTime > 0 ? Math.floor(diffTime / (1000 * 60 * 60 * 24)) : 0
  }

  return (
    <div className="w-full p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Danh Sách Những Quyển Sách Đã Mượn</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-3 border text-sm">STT</th>
                <th className="py-2 px-3 border text-sm">Tên Sách</th>
                <th className="py-2 px-3 border text-sm">Ngày Mượn</th>
                <th className="py-2 px-3 border text-sm">Hẹn Trả</th>
                <th className="py-2 px-3 border text-sm">Ngày Trả</th>
                <th className="py-2 px-3 border text-sm">Quá Hạn (ngày)</th>
                <th className="py-2 px-3 border text-sm">Số Lượng</th>
                <th className="py-2 px-3 border text-sm">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {dockets.length > 0 ? (
                dockets.map((docket, index) => (
                  <tr key={docket.docketObjectId}>
                    <td className="py-2 px-3 border text-sm">{index + 1}</td>
                    <td className="py-2 px-3 border text-sm">
                      {docket.book ? docket.book.bookName : 'Không có thông tin'}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {new Date(docket.ngayMuon).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {new Date(docket.ngayHenTra).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {docket.ngayTra ? new Date(docket.ngayTra).toLocaleDateString() : 'Chưa trả'}
                    </td>
                    <td className="py-2 px-3 border text-sm">
                      {calculateOverdueDays(docket.ngayHenTra, docket.ngayTra)}
                    </td>
                    <td className="py-2 px-3 border text-sm">{docket.soLuongMuon}</td>
                    <td
                      className={`py-2 px-3 border text-sm font-semibold ${
                        docket.statusDocket === 'active'
                          ? 'text-green-600'
                          : docket.statusDocket === 'overdue'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {docket.statusDocket}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 border">
                    Chưa có sách được mượn
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default BorrowedBooks
