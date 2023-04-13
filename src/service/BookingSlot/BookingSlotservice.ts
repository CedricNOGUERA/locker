import axios from "axios";


const API_URL = "http://192.168.1.186:8000/api/"

class BookingSlotService {
    allSlot(token: any) {
        return axios.get(API_URL + "booking_slots", {headers: {"Authorization": "Bearer " + token}})
    }
    slot(token: any, id: any) {
        return axios.get(API_URL + "booking_slots/" + id, {headers: {"Authorization": "Bearer " + token}})
    }
    
      
}


export default new BookingSlotService();