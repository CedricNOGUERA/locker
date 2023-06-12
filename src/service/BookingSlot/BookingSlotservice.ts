import axios from "axios";


const API_URL = process.env.REACT_APP_END_POINT

class BookingSlotService {
    allSlot(token: any) {
        return axios.get(API_URL + "booking_slots", {headers: {"Authorization": "Bearer " + token}})
    }
    slot(token: any, id: any) {
        return axios.get(API_URL + "booking_slots/" + id, {headers: {"Authorization": "Bearer " + token}})
    }
    
      
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new BookingSlotService();