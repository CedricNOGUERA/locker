import axios from "axios";

const API_URL = process.env.REACT_APP_END_POINT

class OrderService {
    allOrders(token: any) {
        return axios.get(API_URL + "orders", {headers: {"Authorization": "Bearer " + token}})
    }
    create(token: any, data: any) {
        return axios.post(API_URL + "orders", {headers: {"Authorization": "Bearer " + token}, data: data})
    }
    update(id: any, token: any, data: any) {
        return axios.patch(API_URL + "orders/" + id , {headers: {"Authorization": "Bearer " + token}, data: data})
    }
}

export default new OrderService();