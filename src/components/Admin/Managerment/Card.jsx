import React, { useCallback, useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { cardStore } from '../../../api/Card'

const Card = () => {
  const { getCard, findCard, updateCardStatus, reactiveCard, cards } = cardStore()
  const [searchText, setSearchText] = useState('')
  const [selectedCard, setSelectedCard] = useState(null)
  const [newExpiryDate, setNewExpiryDate] = useState('')

  const handleFindCard = useCallback(async () => {
    if (!searchText.trim()) {
      alert('Vui lòng nhập thông tin tìm kiếm!')
      return
    }
    try {
      const foundCards = await findCard(searchText)
      if (foundCards && foundCards.length > 0) {
        setSelectedCard(foundCards[0])
        // Mặc định set ngày hết hạn mới là ngày hết hạn hiện tại
        setNewExpiryDate(foundCards[0].ngayHetHan ? foundCards[0].ngayHetHan.split('T')[0] : '')
        alert(`Đã tìm thấy thẻ Sinh viên: ${foundCards[0].MaThe}`)
      } else {
        alert('Không tìm thấy thẻ sinh viên.')
        setSelectedCard(null)
        setNewExpiryDate('')
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm thẻ sinh viên: ', error)
      alert('Lỗi trong quá trình tìm kiếm thẻ sinh viên.')
      setSelectedCard(null)
      setNewExpiryDate('')
    }
  }, [searchText, findCard])

  const fetchCards = useCallback(async () => {
    try {
      await getCard()
      await updateCardStatus()
    } catch (error) {
      console.error('Lỗi lấy dữ liệu và cập nhật trạng thái thẻ sinh viên ', error)
      alert('Lỗi khi tải danh sách thẻ sinh viên hoặc cập nhật trạng thái thẻ.')
    }
  }, [getCard, updateCardStatus])

  useEffect(() => {
    fetchCards()
  }, [fetchCards])

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const handleRowClick = (card) => {
    setSelectedCard(card)
    setNewExpiryDate(card.ngayHetHan ? card.ngayHetHan.split('T')[0] : '')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('vi-VN')
  }

  const handleReactivateCard = async () => {
  if (!selectedCard) {
    alert('Vui lòng chọn thẻ để kích hoạt lại.');
    return;
  }
  if (!newExpiryDate) {
    alert('Vui lòng chọn ngày hết hạn mới.');
    return;
  }
  const today = new Date();
  const selectedDate = new Date(newExpiryDate);
  if (selectedDate < today) {
    alert('Ngày hết hạn mới không được nhỏ hơn ngày hiện tại.');
    return;
  }

  try {
    const res = await reactiveCard(selectedCard._id, newExpiryDate);
    alert(res.message || 'Kích hoạt lại thẻ thành công!');

    if (res.data) {
      setSelectedCard(prev => ({ ...prev, ...res.data }));
      setNewExpiryDate(res.data.ngayHetHan ? res.data.ngayHetHan.split('T')[0] : '');
    }
  } catch (error) {
    console.error('Lỗi kích hoạt lại thẻ:', error);
    alert('Kích hoạt lại thẻ thất bại.');
  }
};


  const styleTable = 'px-4 py-2 border-b border-gray-300 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'

  return (
    <div className='bg-gray-50 rounded shadow-md border border-gray-200 flex flex-col h-full'>
      <div className='p-4 border-b border-gray-200 bg-gray-100'>
        <h2 className='text-xl text-center font-semibold text-gray-700'>Quản lý Thẻ Thư Viện</h2>
      </div>

      <div className='flex items-center p-3 border-b border-gray-200 gap-3 bg-gray-50'>
        <label htmlFor='searchInput' className='font-semibold text-sm text-gray-600 whitespace-nowrap'>Tìm kiếm</label>
        <div className='flex items-center flex-grow'>
          <input
            id='searchInput'
            type='text'
            value={searchText}
            className='flex-grow px-3 py-2 border border-gray-200 rounded-l-md shadow-sm text-sm'
            placeholder='Nhập mã thẻ'
            onChange={handleSearchTextChange}
            onKeyDown={(e) => e.key === 'Enter' && handleFindCard()}
          />
          <button
            onClick={handleFindCard}
            className='flex items-center gap-1 bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-r-md text-sm shadow-sm'
          >
            <Search className='h-5 w-5' /> Tìm
          </button>
        </div>
      </div>

      {selectedCard && (
        <div className='p-4 space-y-4 border-b border-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3'>
            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Mã thẻ:</label>
              <input
                type='text'
                value={selectedCard?.MaThe || ''}
                readOnly
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Mã sinh viên:</label>
              <input
                type='text'
                value={selectedCard?.MaSV?.MaSV || ''}
                readOnly
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Ngày cấp:</label>
              <input
                type='text'
                value={formatDate(selectedCard?.ngayCap)}
                readOnly
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>

            {/* Thay đổi thành input date để chỉnh sửa ngày hết hạn */}
            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Ngày hết hạn mới:</label>
              <input
                type='date'
                value={newExpiryDate}
                onChange={e => setNewExpiryDate(e.target.value)}
                className='px-3 py-2 rounded-md border border-gray-300 text-sm'
                min={new Date().toISOString().split('T')[0]} // hạn chế chọn ngày nhỏ hơn hôm nay
              />
            </div>

            <div className='flex flex-col space-y-1'>
              <label className='text-sm font-medium text-gray-600'>Trạng thái:</label>
              <input
                type='text'
                value={selectedCard?.status}
                readOnly
                className='px-3 py-2 bg-gray-50 rounded-md border border-gray-300 text-sm'
              />
            </div>
          </div>

          <div className='pt-3 flex justify-end'>
            <button
              onClick={handleReactivateCard}
              className='bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded-md shadow-sm text-sm'
            >
              Kích hoạt lại thẻ
            </button>
          </div>
        </div>
      )}

      <div className='flex-grow overflow-auto p-4'>
        <div className='border border-gray-200 rounded-md shadow-sm overflow-hidden'>
          <table className='min-w-full table-auto border-collapse'>
            <thead className='bg-gray-200 sticky top-0 z-10'>
              <tr>
                <th className={styleTable}>STT</th>
                <th className={styleTable}>Mã thẻ</th>
                <th className={styleTable}>Mã SV</th>
                <th className={styleTable}>Ngày cấp</th>
                <th className={styleTable}>Ngày hết hạn</th>
                <th className={styleTable}>Trạng thái</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-300'>
              {cards.map((card, index) => (
                <tr
                  key={card._id}
                  className={`hover:bg-green-50 cursor-pointer ${selectedCard?._id === card._id ? 'bg-green-100 font-semibold' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}`}
                  onClick={() => handleRowClick(card)}
                >
                  <td className={`${styleTable} text-center`}>{index + 1}</td>
                  <td className={styleTable}>{card.MaThe}</td>
                  <td className={styleTable}>{card.MaSV?.MaSV}</td>
                  <td className={styleTable}>{formatDate(card.ngayCap)}</td>
                  <td className={styleTable}>{formatDate(card.ngayHetHan)}</td>
                  <td className={`${styleTable} ${
                    card.status === 'Overdue' ? 'text-red-600 font-bold' :
                    card.status === 'Active' ? 'text-green-600 font-bold' :
                    card.status === 'Suspend' ? 'text-yellow-600 font-bold' : ''
                  }`}>
                    {card.status}
                  </td>
                </tr>
              ))}
              {cards.length === 0 && (
                <tr>
                  <td colSpan={6} className='px-4 py-10 text-center text-gray-500'>
                    Không có thẻ nào trong danh sách.
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

export default Card
