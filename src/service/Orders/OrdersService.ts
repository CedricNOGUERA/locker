import axios from "axios";


const API_URL = "http://192.168.1.186:8000/api/"

class OrderService {
    allOrders(token: any) {
        return axios.get(API_URL + "orders", {headers: {"Authorization": "Bearer " + token}})
    }
    create(token: any, data: any) {
        return axios.post(API_URL + "orders", {headers: {"Authorization": "Bearer " + token}, data: data})
    }
      
}


export default new OrderService();