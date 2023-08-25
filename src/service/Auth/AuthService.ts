import axios from 'axios'

const API_URL = process.env.REACT_APP_END_POINT


class AuthService {
  login(
    userName: string,
    pass: string,
    setToken: any,
    setMsg: any,
    setIsError: any,
    setIsLoadingAuth: any,
    setCodeError: any,
    getMsgError: any
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
        localStorage.setItem('user', response?.data?.token)
        setIsLoadingAuth(false)
      }).catch((error) => {
        console.log(error)
        getMsgError(error?.response?.data?.message ? error?.response?.data?.message : error?.message)
        setCodeError(error?.response?.data?.code !== undefined ? error?.response?.data?.code : "")
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

// eslint-disable-next-line import/no-anonymous-default-export
export default new AuthService()
