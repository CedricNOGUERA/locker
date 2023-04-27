import axios from 'axios'
import { getError } from '../../utils/errors/GetError'
// import { getError } from "../../utils/errors/AxiosError";

// const API_URL = 'https://backend-locker-itl.herokuapp.com/api/'
const API_URL = 'http://192.168.1.250:8000/api/'

class AuthService {
  login(
    userName: string,
    pass: string,
    setToken: any,
    setMsg: any,
    setIsError: any,
    setIsLoadingAuth: any,
    setCodeError: any
  ) {
    setIsLoadingAuth(true)
    let data = JSON.stringify({
      username: userName,
      password: pass,
    })

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: API_URL + 'login_check',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    axios
      .request(config)
      .then((response) => {
        setToken(response.data.token)
        localStorage.setItem('user', response.data.token)
        setIsLoadingAuth(false)
      })
      .catch((error) => {
        console.log(error)
        setMsg(getError(error))
        setCodeError(error.response.data.code)
        setIsError(true)
        setIsLoadingAuth(false)
      })
  }

  logout() {
    localStorage.removeItem('user')
    // authLogout()
  }

  register(userName: string, pass: string) {
    return axios.post(API_URL + 'register', {
      userName,
      pass,
    })
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || '{}')
  }
}

export default new AuthService()
