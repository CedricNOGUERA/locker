import axios from "axios";

const API_URL = process.env.REACT_APP_END_POINT

class OrderService {
    allOrders(token: any) {
        return axios.get(API_URL + "orders" , {headers: {"Authorization": "Bearer " + token}})
    }
    ordersByPage(token: any, page: any) {
        return axios.get(API_URL + "orders/?page=" + page , {headers: {"Authorization": "Bearer " + token}})
    }
    create(token: any, data: any) {
        return axios.post(API_URL + "orders", {headers: {"Authorization": "Bearer " + token}, data: data})
    }
    update(id: any, token: any, data: any) {
        return axios.patch(API_URL + "orders/" + id , {headers: {"Authorization": "Bearer " + token}, data: data})
    }
    order(id: any, token: any) {
        return axios.get(API_URL + "orders/" + id , {headers: {"Authorization": "Bearer " + token}})
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new OrderService();