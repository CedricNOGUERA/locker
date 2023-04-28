import axios from "axios";

const API_URL = process.env.REACT_APP_END_POINT

class ClientService {
    allClients(token: any) {
        return axios.get(API_URL + "clients", {headers: {"Authorization": "Bearer " + token}})
    }
  
}

export default new ClientService();