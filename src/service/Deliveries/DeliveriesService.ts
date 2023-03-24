import axios from "axios";


const API_URL = "http://192.168.1.186:8000/api/"

class DeliveriesService {
    allDeliveries(token: any) {
        return axios.get(API_URL + "deliveries", {headers: {"Authorization": "Bearer " + token}})
    }
      
}


export default new DeliveriesService();