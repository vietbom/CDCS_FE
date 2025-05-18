import React, { useCallback, useEffect, useState } from 'react'
import { Edit3, Eye, EyeOff, Lock, PlusCircle, Search, Trash2, XCircle } from 'lucide-react'
import { adminStore } from '../../../api/Admin'

const initialStudentState = {
  MaSV: '',
  userName: '',
  email: '',
  classroom: '',
  SDT: '',
  password: ''
}

const Student = () => {
  const {
    getStudent,
    findStudent,
    updateStudent, 
    deleteStudent,
    addStudent,
    students
  } = adminStore()

  const [searchText, setSearchText] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [isNewMode, setIsNewMode] = useState(false)
  const [filteredStudents, setFilteredStudents] = useState([])
  const [isFilterActive, setIsFilterActive] = useState(false) 
  const [showPsw, setShowPsw] = useState();
  

  const fetchStudents = useCallback(async () => {
    try {
      await getStudent()
      setIsFilterActive(false) 
      setFilteredStudents([]) 
    } catch (error) {
      console.error('Lỗi lấy dữ liệu sinh viên: ', error)
      alert('Lỗi khi tải danh sách sinh viên.')
    }
  }, [getStudent])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleSearchTextChange = (e) => setSearchText(e.target.value)

  const handleFindStudent = async () => {
    if (!searchText.trim()) {
      alert('Vui lòng nhập thông tin tìm kiếm!')
      return
    }

    try {
      const found = await findStudent(searchText)
      if (found?.length > 0) {
        setFilteredStudents(found)
        setSelectedStudent(null) 
        setIsNewMode(false)
        alert(`Tìm thấy ${found.length} sinh viên.`)
      } else {
        alert('Không tìm thấy sinh viên.')
        setFilteredStudents([])
      }
      setIsFilterActive(true) 
    } catch (error) {
      console.error('Lỗi tìm kiếm sinh viên: ', error)
      alert('Lỗi trong quá trình tìm kiếm.')
      setIsFilterActive(true) 
      setFilteredStudents([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSelectedStudent((prev) => ({ ...prev, [name]: value }))
  }

  const handleRowClick = (student) => {
    setSelectedStudent(student)
    setIsNewMode(false)
  }

  const handlePrepareNewStudent = () => {
    setSelectedStudent(initialStudentState)
    setIsNewMode(true)
    setSearchText('')
  }

  const handleClearForm = () => {
    setSelectedStudent(null)
    setIsNewMode(false)
    setSearchText('')
    setFilteredStudents([])
    setIsFilterActive(false) 
  }

  const handleSubmitNewStudent = async () => {
    if (!selectedStudent?.MaSV || !selectedStudent?.userName || !selectedStudent?.email || !selectedStudent?.classroom) {
      alert('Vui lòng nhập đầy đủ thông tin sinh viên.')
      return
    }

    try {
      const newStudent = { ...selectedStudent }
      delete newStudent._id 
      const res = await addStudent(newStudent)
      if (res) {
        alert('Thêm sinh viên thành công!')
        await fetchStudents() 
        handlePrepareNewStudent() 
      } else {
        alert('Thêm sinh viên thất bại.')
      }
    } catch (error) {
      console.error('Lỗi thêm sinh viên: ', error)
      alert(`Lỗi thêm sinh viên: ${error.message || 'Vui lòng kiểm tra console.'}`)
    }
  }

  const handleUpdateStudent = async () => {
    if (!selectedStudent?._id) {
      alert('Vui lòng chọn sinh viên để cập nhật.')
      return
    }

    if (!selectedStudent?.userName || !selectedStudent?.MaSV || !selectedStudent?.email || !selectedStudent?.SDT) {
      alert('Thông tin không được để trống.')
      return
    }

    try {
      await updateStudent(selectedStudent) 
      alert('Cập nhật sinh viên thành công!')
      await fetchStudents() 
      setSelectedStudent(null) 
      setIsNewMode(false)
    } catch (error) {
      console.error('Lỗi cập nhật sinh viên: ', error)
      alert(`Lỗi cập nhật: ${error.message || 'Vui lòng kiểm tra console.'}`)
    }
  }

  const handleDeleteStudent = async () => {
    if (!selectedStudent?._id) {
      alert('Vui lòng chọn sinh viên để xóa.')
      return
    }
    console.log('select student: ', selectedStudent)

    if (window.confirm(`Xóa sinh viên '${selectedStudent.userName}'?`)) {
      try {
        await deleteStudent(selectedStudent._id)
        alert('Xóa sinh viên thành công!')
        setSelectedStudent(null)
        setIsNewMode(false)
        await fetchStudents() 
      } catch (error) {
        console.error('Lỗi xóa sinh viên: ', error)
        alert(`Lỗi xóa sinh viên: ${error.message || 'Vui lòng kiểm tra console.'}`)
      }
    }
  }

  const styleTable = 'px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
  const styleButton = 'flex items-center gap-2 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[120px]'

  const displayStudents = isFilterActive ? filteredStudents : students

  return (
    <div className='bg-gray-50 rounded shadow-md border border-gray-200 flex flex-col h-full'>
      <div className='p-4 border-b bg-gray-100'>
        <h2 className='text-xl text-center font-semibold text-gray-700'>Quản lí Sinh viên</h2>
      </div>

      <div className='flex items-center p-3 border-b gap-3 bg-gray-50'>
        <label htmlFor='searchInput' className='font-semibold text-sm text-gray-600'>Tìm kiếm:</label>
        <div className='flex items-center flex-grow'>
          <input
            id='searchInput'
            type='text'
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleFindStudent()}
            className='flex-grow px-3 py-2 border border-gray-200 rounded-l-md text-sm'
            placeholder='Nhập mã sinh viên, lớp học ...'
          />
          <button
            onClick={handleFindStudent}
            className='flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-r-md text-sm shadow-sm'
          >
            <Search className='h-5 w-5' /> Tìm
          </button>
        </div>
        <button
          onClick={handleClearForm} 
          className='flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-3 rounded-md text-sm shadow-sm'
        >
          <XCircle className='h-5 w-5' /> Hủy
        </button>
      </div>

      <div className='p-4 border-b'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-md font-semibold text-gray-700'>
            {isNewMode ? 'Thêm sinh viên mới' : (selectedStudent?._id ? 'Chi tiết sinh viên' : 'Thông tin sinh viên')}
          </h3>
          {!isNewMode && !selectedStudent?._id && (
            <button
              onClick={handlePrepareNewStudent}
              className='flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md text-sm shadow-sm'
            >
              <PlusCircle className='h-5 w-5' /> Thêm Mới
            </button>
          )}
        </div>

        {(selectedStudent || isNewMode) && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Mã Sinh viên:</label>
              <input
                type='text'
                name='MaSV'
                value={selectedStudent?.MaSV || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border text-sm'
                readOnly={!isNewMode && !selectedStudent?._id} 
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Họ và tên:</label>
              <input
                type='text'
                name='userName'
                value={selectedStudent?.userName || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Lớp:</label>
              <input
                type='text'
                name='classroom'
                value={selectedStudent?.classroom || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Số điện thoại:</label>
              <input
                type='text'
                name='SDT'
                value={selectedStudent?.SDT || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Email:</label>
              <input
                type='email'
                name='email'
                value={selectedStudent?.email || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border text-sm'
              />
            </div>
            {isNewMode && (
              <div className='flex flex-col space-y-1'>
                <label className='text-sm font-medium text-gray-600'>Mật khẩu:</label>
                <div className='relative'>
                  <span className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
                    <Lock className='h-5 w-5 text-gray-50'/>
                  </span>
                  <input
                    type={showPsw ? 'text' : 'password'}
                    id='password'
                    name='password'
                    placeholder='******'
                    value={selectedStudent?.password || ''}
                    onChange={handleInputChange}
                    className='w-full pr-10 py-2 bg-gray-50 rounded-md border text-sm'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPsw(!showPsw)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPsw ? (
                      <EyeOff className='h-5 w-5 text-gray-400'/>
                    ) : (
                      <Eye className='h-5 w-5 text-gray-400' />
                    )}
                  </button>
                </div>
            </div>
            )}
            
          </div>
        )}
      </div>

      {(selectedStudent || isNewMode) && (
        <div className='p-3 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-3 justify-center md:justify-end'>
          {isNewMode && (
            <button
              onClick={handleSubmitNewStudent}
              className={`${styleButton} bg-green-600 hover:bg-green-700`}
            >
              <PlusCircle className='h-5 w-5'/> Lưu Sinh viên mới
            </button>
          )}
          {!isNewMode && selectedStudent?._id && (
            <>
              <button
                onClick={handleUpdateStudent}
                className={`${styleButton} bg-orange-500 hover:bg-orange-600`}
              >
                <Edit3 className='h-5 w-5'/> Cập nhật
              </button>
              <button
                onClick={handleDeleteStudent}
                className={`${styleButton} bg-red-600 hover:bg-red-700`}
              >
                <Trash2 className='h-5 w-5'/> Xóa Sinh viên 
              </button>
            </>
          )}
          <button
            onClick={isNewMode ? handleClearForm : handlePrepareNewStudent} 
            className={`${styleButton} bg-gray-500 hover:bg-gray-600`}
          >
            <XCircle className='w-5 h-5' />
            {isNewMode ? 'Hủy bỏ' : 'Tạo mới'} 
          </button>
        </div>
      )}

      <div className='flex-grow overflow-auto p-4'>
        <div className='border border-gray-200 rounded-md shadow-sm overflow-hidden'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='bg-gray-200 sticky top-0 z-10'>
              <tr>
                <th className={styleTable}>STT</th>
                <th className={styleTable}>Mã SV</th>
                <th className={styleTable}>Họ tên</th>
                <th className={styleTable}>Lớp</th>
                <th className={styleTable}>SDT</th>
                <th className={styleTable}>Email</th>
              </tr>
            </thead>
            <tbody>
              {displayStudents.length > 0 ? (
                displayStudents.map((student, index) => ( 
                  <tr
                    key={student._id}
                    className={`hover:bg-green-50 cursor-pointer
                      ${selectedStudent?._id === student._id ? 'bg-green-100 font-semibold' : (index % 2 === 0 ? 'bg-white':'bg-gray-50')}
                    `}
                    onClick={() =>handleRowClick(student)}
                  >
                    <td className={`${styleTable} text-center`}>{index + 1}</td>
                    <td className={styleTable}>{student.MaSV}</td>
                    <td className={styleTable}>{student.userName}</td>
                    <td className={styleTable}>{student.classroom}</td>
                    <td className={styleTable}>{student.SDT}</td>
                    <td className={styleTable}>{student.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={`${styleTable} text-center text-gray-500 py-4`}>
                    {isFilterActive ? 'Không tìm thấy sinh viên nào khớp với tìm kiếm.' : 'Chưa có dữ liệu sinh viên.'}
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

export default Student