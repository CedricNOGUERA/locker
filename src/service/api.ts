import axios from 'axios';


const url = "http://127.0.0.1:3003/users";

export const getallUsers = async () => {
    return await axios.get(`${url}`);
}
export const getUserById = async (id: any) => {
    return await axios.get(`${url}/${id}`);
}

export const addUser = async (user: any) => {
    return await axios.post(url,user);
}

export const editUser = async (id: any, user: any) => {
    return await axios.put(`${url}/${id}`,user);
}


export const deleteUser = async (id: any) => {
    return await axios.delete(`${url}/${id}`);
}