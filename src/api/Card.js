import { create } from 'zustand';
import { axiosInstance } from '../lib/axios'; // Assuming axiosInstance is correctly set up

export const cardStore = create((set) => ({
    cards: [],

    findCard: async (searchText) => {
        try {
            const res = await axiosInstance.post('/card/findCard', { MaThe: searchText });
            const foundCards = res.data?.data || [];
            set({ cards: foundCards });
            return foundCards;
        } catch (error) {
            console.error('Lỗi tìm kiếm thẻ sinh viên:', error);
            set({ cards: [] });
            return []; 
        }
        },


    updateCardStatus: async () => {
        try {
            await axiosInstance.post('/card/updateCard');
        } catch (error) {
            console.error('Lỗi cập nhật trạng thái thẻ:', error);
            throw error;
        }
    },

    getCard: async () => {
        try {
            const res = await axiosInstance.get('/card/getCard');
            if (res.data && Array.isArray(res.data.data)) {
                set({ cards: res.data.data });
            } else {
                console.warn('GetCard API did not return expected data structure:', res.data);
                set({ cards: [] });
            }
        } catch (error) {
            console.error('Lỗi lấy danh sách thẻ:', error);
            set({ cards: [] });
            throw error;
        }
    },

    reactiveCard: async (_id, ngayHetHan) => {
        try {
            const res = await axiosInstance.post(`/card/reactiveCard/${_id}`, { ngayHetHan });
            const updatedCard = res.data.data;

            if (updatedCard) {
            set(state => ({
                cards: state.cards.map(card => card._id === _id ? { ...card, ...updatedCard } : card)
            }));
            }
            return res.data;
        } catch (error) {
            console.error('Lỗi kích hoạt lại thẻ:', error);
            throw error;
        }
}


}));