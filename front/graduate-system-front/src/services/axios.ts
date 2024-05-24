import axios from 'axios'
import { USER_TOKEN_NAME } from '@utils/enums'
import { parseCookies } from 'nookies'

const GRADUATE_API = process.env.GRADUATE_API

export function getAPIClient(ctx?: never, isLogin = false) {
  if (isLogin) {
    return axios.create({
      baseURL: GRADUATE_API,
    })
  }

  const { [USER_TOKEN_NAME]: token } = parseCookies(ctx)

  return axios.create({
    baseURL: GRADUATE_API,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
