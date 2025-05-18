import { create } from "zustand"
import { axiosInstance } from "../lib/axios"

export const useBookStore = create((set) => ({
  books: [],
  error: null,
  isLoading: false,

  addBook: async (data) => {
    try {
      const res = await axiosInstance.post("/book/addBook", data)
      set((state) => ({ books: [...state.books, res.data] }))
      return res.data
    } catch (error) {
      console.log("AddBook error response: ", error.response)
      return null
    }
  },

  getBook: async () => {
    set({ isLoading: true, error: null })
    try {
      const res = await axiosInstance.get("/book/getBook")
      set({ books: res.data, error: null, isLoading: false })
      return res.data
    } catch (error) {
      console.error("Error fetching books:", error)
      set({ books: [], error: "Failed to load books.", isLoading: false })
      return null
    }
  },

  searchBook: async (searchText) => {
    set({ isLoading: true, error: null })
    try {
        const res = await axiosInstance.post("/book/searchBook", { infoBook: searchText })
        set({ error: null, isLoading: false })
        return res.data
    } catch (error) {
        const errorMsg = error.response?.data?.message || "Lỗi tìm kiếm sách"
        set({ error: errorMsg, isLoading: false })
        throw new Error(errorMsg)
    }
    },

  updateBook: async (selectedBook) => {
    try {
      const { _id, IdBook, bookName, author, NXB, soLuong, pdfUrl, description } = selectedBook
      const res = await axiosInstance.post(`/book/updateBook/${_id}`, {
        IdBook,
        bookName,
        author,
        NXB,
        soLuong,
        pdfUrl,
        description
      })

      if (res.data) {
        set((state) => ({
          books: state.books.map((book) =>
            book._id === selectedBook._id ? res.data.updatedBook : book
          ),
        }))
        return res.data
      } else {
        return null
      }
    } catch (error) {
      console.error("Error in updating book ", error)
      return null
    }
  },

  deleteBook: async (_id) => {
    try {
      await axiosInstance.delete(`/book/deleteBook/${_id}`)
      set((state) => ({
        books: state.books.filter((book) => book._id !== _id),
      }))
    } catch (error) {
      console.error("Error in deleting Book ", error)
      return null
    }
  },

  getPDF : async (fileName) => {
  try {
    const res = await axiosInstance.get(`/book/getPDF/${fileName}`, { responseType: 'blob' })
    const fileURL = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
    window.open(fileURL)
  } catch (error) {
    console.error("Error in getting book ", error)
  }
}

  
}))