import axios from "axios";


const API_URL = "http://192.168.1.250:8000/api/"

class UserService {
    getAllUser(token: any) {
        return axios.get(API_URL + "users", {headers: {"Authorization": "Bearer " + token}})
    }
    getUserById(id: any, token: any) {
        return axios.get(`${API_URL} + users/${id}`, {headers: {"Authorization": "Bearer " + token}})
    }
    me(token: any) {
        return axios.get(API_URL + "me", {headers: {"Authorization": "Bearer " + token}})
        
    }   
}


export default new UserService();