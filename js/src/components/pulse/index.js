import axios from 'axios'
import Cookies from 'js-cookie'
import jsonwebtoken from 'jsonwebtoken'
import { addClass, removeClass } from '../../utils'

/**
 * Writes an appropriate error message to the pulse element.
 * @param el {Element} - The pulse element.
 * @param expire {number} - The number of milliseconds remaining before the
 *   member's current session expires.
 */

const writeErrorMsg = (el, expire) => {
  if (expire > 0) {
    const mins = Math.floor(expire / 60000)
    const minStr = mins === 1 ? '1&nbsp;minute' : `${mins}&nbsp;minutes`
    const secs = Math.floor((expire - (mins * 60000)) / 1000)
    const secStr = secs === 1 ? '1&nbsp;second' : `${secs}&nbsp;seconds`
    const left = mins > 0
      ? `${minStr} and ${secStr}`
      : secStr
    el.innerHTML = `<p><strong>Your session will expire soon!</strong> We couldn&rsquo;t reauthenticate you. Your session will expire in ${left}.</p>`
  } else {
    el.innerHTML = '<p><strong>Your session has expired!</strong></p>'
  }
}

/**
 * Updates the pulse element with a new error message in a regular interval.
 * @param el {Element} - The pulse element.
 * @param jwt {string} - The JSON Web Token for the member's current session.
 * @param interval {number} - The ID for an interval that updates the error
 *   message.
 */

const updateErrorMsg = (el, jwt, interval) => {
  const expire = getExpiration(jwt)
  writeErrorMsg(el, expire)
  if (expire < 0) clearInterval(interval)
}

/**
 * Updates the pulse element with an initial error message.
 * @param el {Element} - The pulse element.
 * @param jwt {string} - The JSON Web Token for the member's current session.
 */

const sendErrorMsg = (el, jwt) => {
  const expire = getExpiration(jwt)
  writeErrorMsg(el, expire)
  const interval = setInterval(() => updateErrorMsg(el, jwt, interval), 1000)
  removeClass(el, 'warning')
  addClass(el, 'error')
}

/**
 * Send a reauthentication request to the API.
 * @param el {Element} - The pulse element.
 * @param jwt {string} - The JSON Web Token for the member's current session.
 * @returns {Promise<void>} - A Promise that resolves once the reauthentication
 *   request has been sent, and the API has returned a response. If it was
 *   successful, a new timeout is set to reauthenticate again in 10 minutes.
 *   If it was not successful, the pulse element is updated with an error
 *   message.
 */

const reauth = async (el, jwt) => {
  try {
    await axios.post('https://api.thefifthworld.com/v1/members/reauth', null, { headers: { Authorization: `Bearer ${jwt}` } })
    setTimeout(async () => { await reauth(el, jwt) }, 10 * 60 * 1000)
  } catch (err) {
    sendErrorMsg(el, jwt)
  }
}

/**
 * Figure out when the JWT will expire.
 * @param jwt {string} - The JWT to examine.
 * @returns {number} - The number of milliseconds left before the JWT expires.
 */

const getExpiration = jwt => {
  const user = jsonwebtoken.decode(jwt)
  const now = new Date()
  return (user.exp * 1000) - now.getTime()
}

/**
 * Initialize pulse component.
 * @param elems {Element[]} - Elements that invoke the pulse component.
 */

const initPulse = elems => {
  const el = elems && Array.isArray(elems) && elems.length > 0 ? elems[0] : null
  if (el) {
    addClass(el, 'initialized')
  }

  // Are we mocking a JWT cookie for demonstration purposes?
  if (el && el.dataset.mockJwt !== undefined && Cookies.get('jwt') === undefined) {
    const min5 = new Date(new Date().getTime() + (5 * 60 * 1000))
    const userObj = { name: 'Ish', id: 1949, email: 'ish@thefifthworld.com', exp: Math.floor(min5.getTime() / 1000) }
    const mock = jsonwebtoken.sign(userObj, 'NOTAVERYGOODKEY')
    Cookies.set('jwt', mock, { expires: min5 })
  }

  // Start loop
  const jwt = Cookies.get('jwt')
  const timeout = getExpiration(jwt) - 120000
  setTimeout(async () => { await reauth(el, jwt) }, timeout)
}

export default initPulse
