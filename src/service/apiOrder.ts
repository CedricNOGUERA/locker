import axios from "axios";

const url = "http://127.0.0.1:3003/commandes";


export const getAllcdes = async () => {
    return await axios.get(`${url}`);
}
