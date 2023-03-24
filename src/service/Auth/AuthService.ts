import axios from "axios";

const API_URL = "http://192.168.1.186:8000/api/";


class AuthService {
    login(userName: string, pass: string, setToken: any) {

        let data = JSON.stringify({
            "username": userName,
            "password": pass
          });
          
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: API_URL + 'login_check',
            headers: { 
              'Content-Type': 'application/json',
            },
            data : data
          };

          axios.request(config)
          .then((response) => {
            setToken(response.data.token)
            localStorage.setItem("user", response.data.token);
          })
          .catch((error) => {
            console.log(error);
          });
  }

  logout() {
    localStorage.removeItem("user");
    // authLogout()
  }

  register(userName: string, pass: string) {
    return axios.post(API_URL + "register", {
      userName,
      pass,
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }
}

export default new AuthService();