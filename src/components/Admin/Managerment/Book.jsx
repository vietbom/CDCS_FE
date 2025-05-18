import React, { useCallback, useEffect, useState } from 'react'
import {Edit3, PlusCircle, Search, Trash2, XCircle} from 'lucide-react'
import { useBookStore } from '../../../api/Book'

const formBookState = {
  IdBook: '',
  bookName: '',
  author: '',
  NXB: '',
  soLuong: '',
  soLuongCon: '',
  pdfUrl: '',
  description: ''

}
const Book = () => {
  const {getBook, books, searchBook, addBook, updateBook, deleteBook } =useBookStore()
  const [searchText, setSearchText] = useState('')
  const [selectedBook , setSelectedBook] = useState(null)
  const [isNewMode, setIsNewMode] = useState(false) 
  //biến theo dõi người dùng đang ở chế độ thêm 1 cuốn sách hoàn toàn mới và xem/chỉnh sửa 1 cuốn sách đã tồn tạitại
  
  const handleFindBook = useCallback(async () => {
    if (!searchText.trim()) {
      alert('Vui lòng nhập thông tin tìm kiếm!')
      return
    }
    try {
      const foundBooks = await searchBook(searchText)
      if (foundBooks && foundBooks.length > 0) {
        setSelectedBook(foundBooks[0])
        setIsNewMode(false) 
        console.log(`Đã tìm thấy sách: ${foundBooks[0].bookName}`)
        alert(`Đã tìm thấy sách: ${foundBooks[0].bookName}`)
      } else {
        alert('Không tìm thấy sách.')
        setSelectedBook(null) 
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm sách: ', error)
      alert('Lỗi trong quá trình tìm kiếm sách.')
      setSelectedBook(null)
    }
  }, [searchText, searchBook])

  const fetchBooks = useCallback(async () => {
    try {
      await getBook()
    } catch (error) {
      console.error('Lỗi lấy dữ liệu sách ', error)
      alert('Lỗi khi tải danh sách sách.')
    }
  }, [getBook])
  
  useEffect(() => {
    fetchBooks()
  }, [fetchBooks])

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleInputChange = (e) => {
    const {name, value} = e.target
    let processedvalue = value
    if(name === 'soLuong' || name === 'soLuongCon'){
      processedvalue = value === '' ? '' :Number(value)
    }
    
    setSelectedBook(prevState => {
      const newState = {
        ...prevState,
        [name]: processedvalue
      }
      if(isNewMode && name === 'soLuong'){
        newState.soLuongCon = processedvalue
      }
      return newState
    })
  }

  const handleRowClick = (book) => {
    console.log('SeclectedBook: ',book)
    setSelectedBook(book)
    setIsNewMode(false)
  }

  const handlePrepareNewBook = () => {
    setSelectedBook(formBookState)
    setIsNewMode(true)
    setSearchText('')
  }

  const handlSubmitNewBook = async() => {
    if(!selectedBook || !selectedBook.bookName || !selectedBook.IdBook || !selectedBook.author || !selectedBook.NXB || !selectedBook.soLuong ){
      alert('Vui lòng nhập thông tin sách đầy đủ.')
    }
    const newBook = {
      ...selectedBook,
      soLuong: Number(selectedBook.soLuong) || 0,
      soLuongCon: Number(selectedBook.soLuongCon) || Number(selectedBook.soLuong) || 0
    }
    delete newBook._id
    try {
      const res = await addBook(newBook)
      if(res){
        alert('Thêm sách thành công ')
        handlePrepareNewBook()
        fetchBooks()
      }else{
        alert('Thêm sách thất bại. Vui lòng thử lại.')
      }
    } catch (error) {
      console.error("Lỗi thêm sách: ", error)
      alert(`Lỗi thêm sách: ${error.message || 'Vui lòng kiểm tra console.'}`)
    }
  }

  const handleUpadteBook = async() =>{
    if (!selectedBook || !selectedBook._id) {
      alert('Vui lòng chọn một sách từ bảng để cập nhật.')
      return
    }
    if(!selectedBook || !selectedBook.bookName || !selectedBook.IdBook || !selectedBook.author || !selectedBook.NXB || !selectedBook.soLuong ){
      alert('Thông tin không được để trống.')
      return
    }
    try {
      const bookDataUpdate = {
        ...selectedBook,
        soLuong: Number(selectedBook.soLuong) || 0,
        soLuongCon: Number(selectedBook.soLuongCon) || 0,
      }
      await updateBook(bookDataUpdate)
      alert('Cập nhật sách thành công!')
      fetchBooks() 
    } catch (error) {
      console.error("Lỗi cập nhật sách: ", error)
      alert(`Lỗi cập nhật sách: ${error.message || 'Vui lòng kiểm tra console.'}`)
    }
  }

  const handleDeleteBook = async() =>{
    if (!selectedBook || !selectedBook._id) {
      alert('Vui lòng chọn một sách từ bảng để xóa.')
      return
    }
    if(window.confirm(`Bạn có chắc chắn muốn xóa sách '${selectedBook.bookName}'? `)){
      try {
        await deleteBook(selectedBook._id)
        alert('Xóa sách thành công!')
        setSelectedBook(null)
        setIsNewMode(false)
        fetchBooks()
      } catch (error) {
        console.error("Lỗi xóa sách: ", error)
        alert(`Lỗi xóa sách: ${error.message || 'Vui lòng kiểm tra console.'}`)
      }
    }
  }

  const handleClearForm = () => {
    setSelectedBook(null)
    setIsNewMode(false)
    setSearchText('')
  }

  const styleTable = 'px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'

  return (
    <div className='bg-gray-50 rounded shadow-md border border-gray-200 flex flex-col h-full'>
      <div className='p-4 border-b border-gray-200 bg-gray-100'>
        <h2 className='text-xl text-center font-semibold text-gray-700'>Quản lí Giáo trình - Sách </h2>
      </div>

      <div className='flex items-center p-3 border-b border-gray-200 gap-3 bg-gray-50'>
        <label htmlFor='searchInput' className='font-semibold text-sm text-gray-600 whitespace-nowrap'>Tìm kiếm sách:</label>
        <div className='flex items-center flex-grow'>
          <input
            id='searchInput'
            type='text'
            className='flex-grow px-3 py-2 border border-gray-200 rounded-l-md shadow-sm text-sm'
            placeholder='Nhập mã sách , tên sách, tác giả...'
            value={searchText}
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleFindBook()}
          />
          <button
            onClick={handleFindBook}
            className='flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-l-md py-2 px-4 rounded-r-md text-sm whitespace-nowrap shadow-sm'
          >
            <Search className='h-5 w-5'/> Tìm 
          </button>
        </div>
        <button
          onClick={handleClearForm}
          title='Xóa tìm kiếm và form'
          className='flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-3 rounded-md text-sm whitespace-nowrap shadow-sm transition-colors duration-150'
        >
          <XCircle className='h-5 w-5'/> Hủy 
        </button>
      </div>

      <div className='p-4 space-y-4 border-b border-gray-200'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-md font-semibold text-gray-700 mb-2'>
            {!isNewMode ? 'Thêm sách mới' :(selectedBook?._id ? 'Chi tiết sách (Chỉnh sửa)' : 'Thông tin chi tiết')}
          </h3>
          {!isNewMode && !selectedBook?._id && (
            <button
              onClick={handlePrepareNewBook}
              className='flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md text-sm shadow-sm transition-colors duration-150'
            >
              <PlusCircle className='h-5 w-5'/> Thêm Mới
            </button>
          )}
        </div>
        {(selectedBook || isNewMode) && (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Mã sách: </label>
              <input 
                type='text'
                name='IdBook'
                value={selectedBook?.IdBook || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
                readOnly={!isNewMode && !selectedBook?._id}
              /> 
            </div>
            
            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Tên sách: </label>
              <input
                type='text'
                name='bookName'
                value={selectedBook?.bookName || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Tác giả: </label>
              <input
                type='text'
                name='author'
                value={selectedBook?.author || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Nhà xuất bản: </label>
              <input
                type='text'
                name='NXB'
                value={selectedBook?.NXB || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Số Lượng: </label>
              <input
                type='number'
                name='soLuong'
                min= '0'
                value={selectedBook?.soLuong === '' ? '' : Number(selectedBook?.soLuong)}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col shadow-sm space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>Số Lượng còn lại: </label>
              <input
                type='number'
                name='soLuongCon'
                value={selectedBook?.soLuongCon === '' ? '' : Number(selectedBook?.soLuongCon)}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
                readOnly={isNewMode}
              />
            </div>

            <div className='flex flex-col space-y-1 mb-2'>
              <label className='text-sm font-medium text-gray-600'>PDF URL: </label>
              <input
                type='text'
                name='pdfUrl'
                value={selectedBook?.pdfUrl || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1 mb-2 md:col-span-2'>
              <label className='text-sm font-medium text-gray-600'>Mô tả sách: </label>
              <textarea 
                name='description'
                rows={3}
                value={selectedBook?.description || ''}
                onChange={handleInputChange}
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
                placeholder='Nhập mô tả về sách (nếu có)...'
              /> 
            </div>
          </div>
        )}
      </div>

      {(selectedBook || isNewMode) && (
        <div className='p-3 bg-gray-100 border-t border-gray-200 flex flex-wrap gap-3 justify-center md:justify-end'>
          {isNewMode && (
            <button
              onClick={handlSubmitNewBook}
              className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[120px]'
            >
              <PlusCircle className='h-5 w-5'/> Lưu Sách mới 
            </button>
          )}
          {!isNewMode && selectedBook?._id && (
            <>
              <button
                onClick={handleUpadteBook}
                className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[120px]'
              >
                <Edit3 className='h-5 w-5'/>Cập Nhật
              </button>
              <button
                onClick={handleDeleteBook}
                className='flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[120px]'
              >
                <Trash2 className='h-5 w-5'/>Xóa Sách
              </button>
            </>
          )}
          <button
            onClick={handlePrepareNewBook}
            className='flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded shadow-sm transition-colors duration-150 ease-in-out text-sm min-w-[120px]'
          >
            <XCircle className='h-5 w-5'/>{isNewMode || !selectedBook?._id ? 'Hủy bỏ' : 'Tạo mới'}
          </button>
        </div>
      )}
      
      <div className='flex-grow overflow-auto p-4'>
        <div className='border border-gray-200 rounded-md shadow-sm overflow-hidden'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='bg-gray-200 sticky top-0 z-10'>
              <tr>
                <th className={styleTable}>STT</th>
                <th className={styleTable}>Mã sách </th>
                <th className={styleTable}>Tên sách </th>
                <th className={styleTable}>Tác giả </th>
                <th className={styleTable}>NXB </th>
                <th className={styleTable}>SL tổng </th>
                <th className={styleTable}>SL còn lại </th>
                <th className={styleTable}>PDF URL </th>
              </tr>
            </thead>

            <tbody className='bg-white divide-y divide-gray-300'>
              {books.map((book, index) => (
                <tr 
                  key={book._id}
                  className={`hover:bg-green-50 cursor-pointer
                    ${selectedBook?._id === book._id ? 'bg-green-100 font-semibold' : (index % 2 === 0 ? 'bg-white':'bg-gray-50')}
                    `}
                  onClick={() =>handleRowClick(book)}
                >
                <td className={`${styleTable} text-center`}>{index + 1}</td>
                <td className={styleTable}>{book.IdBook}</td>
                <td className={styleTable}>{book.bookName}</td>
                <td className={styleTable}>{book.author}</td>
                <td className={styleTable}>{book.NXB}</td>
                <td className={`${styleTable} text-center`}>{book.soLuong}</td>
                <td className={`${styleTable} text-center`}>{book.soLuongCon}</td>
                <td className={`${styleTable} truncate max-w-xs`}>
                  {book.pdfUrl && (
                    <a 
                      href={book.pdfUrl} 
                      target='_blank' 
                      rel='noopener noreferrer' 
                      className='text-blue-600 hover:text-blue-800 ' 
                      onClick={(e) => e.stopPropagation()}
                    >
                      PDF
                    </a>

                  )}
                </td>
              </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={8} className='px-4 py-10 text-center text-gray-500'>
                    Không có sách nào trong danh sách.
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

export default Book
