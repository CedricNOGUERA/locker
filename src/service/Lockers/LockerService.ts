import axios from "axios";

const API_URL = process.env.REACT_APP_END_POINT

class LockerService {
    allLockers(token: any) {
        return axios.get(API_URL + "lockers" , {headers: {"Authorization": "Bearer " + token}})
    }
   
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new LockerService();