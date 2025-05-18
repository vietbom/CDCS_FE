import React, { useCallback, useEffect, useState } from 'react'
import { PlusCircle, Search, XCircle } from 'lucide-react'
import { useDocketStore } from '../../../api/Docket'

const formatDate = (dateString) =>
  dateString ? new Date(dateString).toLocaleDateString('vi-VN') : ''

const generateInitialDocketState = () => {
  const now = new Date()
  const ngayMuon = now.toISOString().split('T')[0]
  const ngayHenTraDate = new Date(now)
  ngayHenTraDate.setMonth(now.getMonth() + 5)
  const ngayHenTra = ngayHenTraDate.toISOString().split('T')[0]
  return {
    IdDocket: `PM${Date.now()}`,
    books: [{ IdBook: '', bookName: '', soLuongMuon: '' }],
    MaThe: '',
    ngayMuon,
    ngayHenTra
  }
}

const Docket = () => {
  const { createDocket, findDocket, getDockets, returnBook, dockets } = useDocketStore()
  const [searchText, setSearchText] = useState('')
  const [selectedDocket, setSelectedDocket] = useState(null)
  const [filteredDockets, setFilteredDockets] = useState([])
  const [isNewMode, setIsNewMode] = useState(false)

  const fetchDockets = useCallback(async () => {
    try {
      const res = await getDockets()
      setFilteredDockets(res?.data || [])
    } catch (error) {
      console.error('Lỗi lấy dữ liệu phiếu mượn trả : ', error)
      alert('Lỗi khi tải danh sách phiếu mượn trả.')
    }
  }, [getDockets])

  useEffect(() => {
    fetchDockets()
  }, [fetchDockets])

  const handleSearchDocket = async () => {
    if (!searchText.trim()) {
      alert('Vui lòng nhập thông tin tìm kiếm!')
      return
    }
    try {
      const result = await findDocket(searchText)
      if (result?.length > 0) {
        setFilteredDockets(result)
        setSelectedDocket(null)
        setIsNewMode(false)
        alert(`Tìm thấy Phiếu mượn ${result.length} sinh viên.`)
      } else {
        alert('Không tìm thấy sinh viên.')
        setFilteredDockets([])
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm phiếu mượn:', error)
      alert('Lỗi khi tìm kiếm phiếu mượn.')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSelectedDocket((prev) => ({ ...prev, [name]: value }))
  }

  const handleRowClick = (docket) => {
    setSelectedDocket(docket)
    setIsNewMode(false)
  }

  const handlePrepareNewDocket = () => {
    setSelectedDocket(generateInitialDocketState())
    setIsNewMode(true)
    setSearchText('')
  }

  const handleClearForm = () => {
    setSelectedDocket(null)
    setIsNewMode(false)
    setSearchText('')
    setFilteredDockets([])
  }

  const handleNewBookRow = () => {
    setSelectedDocket(prev => ({
      ...prev,
      books: [...(prev.books || []), { IdBook: '', bookName: '', soLuongMuon: '' }]
    }))
  }

  const updateBookField = (index, field, value) => {
    setSelectedDocket(prev => {
      const newBooks = [...(prev.books || [])]
      newBooks[index][field] = value
      return { ...prev, books: newBooks }
    })
  }

const handleSubmitNewDocket = async () => {
  if (!selectedDocket?.MaThe || !selectedDocket?.books || !selectedDocket?.ngayHenTra) {
    alert('Vui lòng nhập đầy đủ thông tin')
    return
  }

  try {
    const newDocket = { ...selectedDocket }
    delete newDocket._id

    const res = await createDocket(newDocket)

    if (res?.success) {
      alert('Thêm phiếu mượn sách của sinh viên thành công!')
      await fetchDockets()
      handlePrepareNewDocket()
    } else {
      alert(res?.message || 'Thêm phiếu mượn thất bại.')
    }
  } catch (error) {
    console.error('Lỗi thêm phiếu mượn sinh viên: ', error)
    alert(`Lỗi thêm phiếu mượn sinh viên: ${error.message || 'Vui lòng kiểm tra console.'}`)
  }
}


const handleReturnBook = async (bookIdRaw) => {
  if (!selectedDocket?._id) return;

  const confirm = window.confirm('Bạn có chắc muốn trả cuốn sách này không?');
  if (!confirm) return;

  const bookId = typeof bookIdRaw === 'object'
    ? bookIdRaw._id || bookIdRaw.IdBook || ''
    : bookIdRaw;

  console.log("Gọi API trả sách với:", selectedDocket._id, bookId);

  const res = await returnBook(selectedDocket._id, bookId);
  console.log("Kết quả trả sách:", res);

  if (res?.success) {
    alert('Trả sách thành công!');
    await fetchDockets();
    setSelectedDocket(null);
  } else {
    alert(res?.message || 'Lỗi khi trả sách.');
  }
}

  const displayList = filteredDockets.length > 0 ? filteredDockets : dockets

  const styleTable = 'px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'

  return (
    <div className='bg-gray-50 rounded shadow-md border border-gray-200 flex flex-col h-full'>
      <div className='p-4 border-b border-gray-200 bg-gray-100'>
        <h2 className='text-xl text-center font-semibold text-gray-700'>Quản lí Phiếu mượn/trả sách</h2>
      </div>

      <div className='flex items-center p-3 border-b border-gray-200 gap-3 bg-gray-50'>
        <label htmlFor='searchInput' className='font-semibold text-sm text-gray-600 whitespace-nowrap'>Tìm kiếm:</label>
        <div className='flex items-center flex-grow'>
          <input
            id='searchInput'
            type='text'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchDocket()}
            className='flex-grow px-3 py-2 border border-gray-200 rounded-l-md shadow-sm text-sm'
            placeholder='Nhập mã SV hoặc mã thẻ...'
          />
          <button
            onClick={handleSearchDocket}
            className='flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-r-md text-sm shadow-sm'
          >
            <Search className='h-5 w-5' /> Tìm
          </button>
        </div>
        <button onClick={handleClearForm} className='text-red-600 hover:text-red-800 flex items-center text-sm gap-1'>
          <XCircle className='h-5 w-5' /> Hủy
        </button>
      </div>

      <div className='p-4 space-y-4 border-b border-gray-200'>
        <div className='flex justify-between items-center mb-2'>
        <h3 className='text-md font-semibold text-gray-700 mb-2'>
            {!isNewMode ? 'Thêm phiếu mượn mới' :(selectedDocket?._id ? 'Chi tiết phiếu mượn  (Chỉnh sửa)' : 'Thông tin chi tiết')}
        </h3>
        {!isNewMode && !selectedDocket?._id && (
            <button
            onClick={handlePrepareNewDocket}
            className='flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md text-sm shadow-sm transition-colors duration-150'
            >
            <PlusCircle className='h-5 w-5'/> Thêm phiếu mượn Mới
            </button>
        )}
        </div>
        {(selectedDocket || isNewMode) && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Mã Phiếu mượn: </label>
              <input 
                  type='text'
                  name='IdDocket'
                  value={selectedDocket?.IdDocket || ''}
                  onChange={handleInputChange}
                  className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
                  readOnly={!isNewMode && !selectedDocket?._id}
              /> 
            </div>
            
            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Mã thẻ: </label>
              <input
                  type='text'
                  name='MaThe'
                  value={selectedDocket?.MaThe || ''}
                  onChange={handleInputChange}
                  className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='border-t pt-4'>
              <h4 className='font-semibold mb-2'>Danh sách sách mượn</h4>
              {(selectedDocket?.books || []).map((book, i) => (
                  <div key={i} className='grid grid-cols-3 gap-3 mb-2'>
                  <input
                      type='text'
                      placeholder='Mã sách'
                      value={book.IdBook}
                      onChange={(e) => updateBookField(i, 'IdBook', e.target.value)}
                      className='px-3 py-2 border rounded-md text-sm'
                  />
                  <input
                      type='text'
                      placeholder='Tên sách'
                      value={book.bookName}
                      onChange={(e) => updateBookField(i, 'bookName', e.target.value)}
                      className='px-3 py-2 border rounded-md text-sm'
                  />
                  <input
                      type='number'
                      placeholder='Số lượng'
                      value={book.soLuongMuon}
                      max={5}
                      onChange={(e) => updateBookField(i, 'soLuongMuon', e.target.value)}
                      className='px-3 py-2 border rounded-md text-sm'
                  />
                   {!isNewMode && (
                    <button
                      className='bg-yellow-500 text-white px-3 py-1 rounded'
                      onClick={() => handleReturnBook(book)}
                    >
                      Trả sách
                    </button>
                  )}
                  </div>
              ))}

              {isNewMode && (
                <button onClick={handleNewBookRow} className='mt-2 bg-blue-600 text-white px-3 py-1 rounded'>+ Thêm sách</button>
              )}
              
            </div>

            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Ngày mượn: </label>
              <input
                  type='date'
                  name='ngayMuon'
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDocket?.ngayMuon ? new Date(selectedDocket.ngayMuon).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
                  readOnly={!isNewMode}
              />
            </div>

            <div className='flex flex-col shadow-sm space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Ngày hẹn trả: </label>
              <input
                  type='date'
                  name='ngayHenTra'
                  value={selectedDocket?.ngayHenTra ? new Date(selectedDocket.ngayHenTra).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                  className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
                  readOnly={!isNewMode}
              />
            </div>
            
            {isNewMode && (
              <div className='pt-4'>
                <button
                onClick={handleSubmitNewDocket}
                className='bg-green-600 text-white px-4 py-2 rounded shadow-sm hover:bg-green-700'
                >
                Lưu phiếu mượn
                </button>
            </div>
            )}

        </div>
        )}
      </div>

      <div className='flex-grow overflow-auto p-4'>
          <div className='border border-gray-200 rounded-md shadow-sm overflow-hidden'>
            <table className='min-w-full table-auto border-collapse'>
                <thead className='bg-gray-200 sticky top-0 z-10'>
                <tr>
                    <th className={styleTable}>STT</th>
                    <th className={styleTable}>Mã phiếu</th>
                    <th className={styleTable}>Mã thẻ</th>
                    <th className={styleTable}>Sách mượn</th>
                    <th className={styleTable}>Số lượng </th>
                    
                    <th className={styleTable}>Ngày mượn</th>
                    <th className={styleTable}>Ngày hẹn trả</th>
                    <th className={styleTable}>Ngày trả</th>
                    <th className={styleTable}>Trạng thái</th>
                </tr>
                </thead>

                <tbody>
                {displayList.map((docket, index) => {
                  const books = docket.books || [];
                  if (!books.length) {
                    return (
                      <tr key={docket._id} className='bg-yellow-50 text-gray-600'>
                        <td className={`${styleTable} text-center`}>{index + 1}</td>
                        <td className={styleTable}>{docket.IdDocket}</td>
                        <td className={styleTable}>{docket.MaThe || ''}</td>
                        <td colSpan={2} className={`${styleTable} text-center italic`}>
                          Không có sách mượn
                        </td>
                        <td className={styleTable}>{formatDate(docket.ngayMuon)}</td>
                        <td className={styleTable}>{formatDate(docket.ngayHenTra)}</td>
                        <td className={styleTable}>{formatDate(docket.ngayTra)}</td> 
                        <td className={styleTable}>{docket.status}</td>
                      </tr>
                    );
                  }

                  return books.map((book, i) => (
                    <tr
                      key={`${docket._id}-${i}`}
                      className={`hover:bg-green-50 cursor-pointer ${
                        selectedDocket?._id === docket._id
                          ? 'bg-green-100 font-semibold'
                          : index % 2 === 0
                          ? 'bg-white'
                          : 'bg-gray-50'
                      }`}
                      onClick={() => handleRowClick(docket)}
                    >
                      {i === 0 && (
                        <>
                          <td className={`${styleTable} text-center`} rowSpan={books.length}>{index + 1}</td>
                          <td className={styleTable} rowSpan={books.length}>{docket.IdDocket}</td>
                          <td className={styleTable} rowSpan={books.length}>{docket.MaThe || ''}</td>
                        </>
                      )}

                      <td className={styleTable}>
                        <span className='font-medium'>{book.IdBook}</span> - {book.bookName}
                      </td>

                      <td className={styleTable}>{book.soLuongMuon}</td>

                      {i === 0 && (
                        <>
                          <td className={styleTable} rowSpan={books.length}>{formatDate(docket.ngayMuon)}</td>
                          <td className={styleTable} rowSpan={books.length}>{formatDate(docket.ngayHenTra)}</td>
                          <td className={styleTable} rowSpan={books.length}>{formatDate(docket.ngayTra)}</td>
                          <td className={styleTable} rowSpan={books.length}>{docket.status}</td>
                        </>
                      )}
                    </tr>
                  ))
                })}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  )
}

export default Docket
