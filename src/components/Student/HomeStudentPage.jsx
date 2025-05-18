import React from 'react'
import StudentInfo from './StudentInfo'
import BookSearch from './BookSearch'
import BorrowedBooks from './BorrowedBooks'

const HomeStudentPage = () => {
  return (
    <div className="w-full bg-gray-100 min-h-screen ">  
        <div className="max-w-5xl mx-auto bg-white shadow-lg overflow-hidden">
          <header className="bg-green-400 text-white p-3 text-center">
            <h1 className="text-xl font-semibold">Sinh viên </h1>
          </header>
          <div className="flex flex-col md:flex-row">
            <StudentInfo />
            <BookSearch />
          </div>
          <BorrowedBooks />
        </div>
      </div>
  )
}

export default HomeStudentPage
