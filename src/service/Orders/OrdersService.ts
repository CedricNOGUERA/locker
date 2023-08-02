import axios from "axios";

const API_URL = process.env.REACT_APP_END_POINT
// const API_PRESTA = "https://prestashop.itahitilab.io/api/"

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
        return axios.patch(API_URL + "orders/" + id , data, {headers: {"Authorization": "Bearer " + token}})
    }
    order(id: any, token: any) {
        return axios.get(API_URL + "orders/" + id , {headers: {"Authorization": "Bearer " + token}})
    }
    // prestaOrders(id: any){
    //     return axios.get(API_PRESTA + "order_details/" + id +"?output_format=JSON", {url: 'https://prestashop.itahitilab.io/api/order_details/5?output_format=JSON&ws_key=GAQVK8PIT3GLV3XBBHNR3EGR9EWJSHUB',headers: {'Cookie': 'PrestaShop-1b5a073e13c19294c471fb581e4724a2=def50200369329de66cc586fbf4d1b6509dfd7b057371a05af56874fc128bacc226bf303b228ea7c523760580b8695135eded839eacfa9f60fe4c2945b7f88aacad2f34af80c085488e0ed23ed463a92a7d97cbe6af6eb1b58379dbfc8a9b3c235bb0a62e198097ef5eca677eebf2db8839203312b9b1a13fbe10b952985f06669094e4d0068ed8df36dc0605f305fdb625d3a83dca7b5949fb6d318c50e68c5512107',}})
    // }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new OrderService();