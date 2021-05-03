import axios from 'axios'
import Cookies from 'js-cookie'
import jsonwebtoken from 'jsonwebtoken'
import { addClass, removeClass, closest, create } from '../../utils'

/**
 * Writes an appropriate error message to the pulse element.
 * @param el {Element} - The pulse element.
 * @param expire {number} - The number of milliseconds remaining before the
 *   member's current session expires.
 */

const writeErrorMsg = (el, expire) => {
  const inForm = closest(el, 'form')
    ? ' If you submit the form after your session expires, you might lose your work!'
    : ''
  if (expire > 0) {
    const mins = Math.floor(expire / 60000)
    const minStr = mins === 1 ? '1&nbsp;minute' : `${mins}&nbsp;minutes`
    const secs = Math.floor((expire - (mins * 60000)) / 1000)
    const secStr = secs === 1 ? '1&nbsp;second' : `${secs}&nbsp;seconds`
    const left = mins > 0
      ? `${minStr} and ${secStr}`
      : secStr
    el.innerHTML = `<p><strong>Your session will expire soon!</strong> We couldn&rsquo;t reauthenticate you.${inForm} Your session will expire in ${left}.</p>`
  } else {
    el.innerHTML = `<p><strong>Your session has expired!</strong> We couldn&rsquo;t reauthenticate you.${inForm}</p>`
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
  const expire = jwt ? getExpiration(jwt) : -1
  writeErrorMsg(el, expire)
  const interval = jwt ? setInterval(() => updateErrorMsg(el, jwt, interval), 1000) : null
  removeClass(el, 'warning')
  addClass(el, 'error')
}

/**
 * Send a reauthentication request to the API.
 * @param el {Element} - The pulse element.
 * @returns {Promise<void>} - A Promise that resolves once the reauthentication
 *   request has been sent, and the API has returned a response. If it was
 *   successful, a new timeout is set to reauthenticate again in 10 minutes.
 *   If it was not successful, the pulse element is updated with an error
 *   message.
 */

const reauth = async (el) => {
  try {
    const jwt = Cookies.get('jwt')
    const res = await axios.post(el.dataset.reauth, null, { headers: { Authorization: `Bearer ${jwt}` } })
    Cookies.set('jwt', res.data)
    setTimeout(async () => { await reauth(el) }, 10 * 60 * 1000)
  } catch (err) {
    sendErrorMsg(el)
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
  return user ? (user.exp * 1000) - now.getTime() : 0
}

/**
 * Initialize Pulse demo form.
 */

const initPulseDemo = () => {
  const el = document.querySelector('.pulse-demo:not(.initialized)')
  const addNotice = el => {
    const notice = create('p', [], {}, 'You are now logged in. The pulse component will keep you logged in. You shouldn’t see anything at all, unless something goes wrong with an attempt to reauthenticate you.')
    el.insertAdjacentElement('afterend', notice)
  }

  if (el && !Cookies.get('jwt')) {
    addClass(el, 'initialized')
    const form = el.querySelector('form')
    if (form) {
      form.addEventListener('submit', async event => {
        event.preventDefault()
        event.stopPropagation()
        const email = document.getElementById('pulse-demo-email').value
        const pass = document.getElementById('pulse-demo-passphrase').value
        try {
          const res = await axios.post(form.dataset.auth, { email, pass })
          Cookies.set('jwt', res.data)
          removeClass(el, 'initialized')
          addNotice(el)
        } catch (err) {
          console.error(err)
        }
      })
    }

    const wrapper = el.querySelector('.buttons')
    if (wrapper) {
      const btn = create('button', [], {}, 'Log in')
      wrapper.appendChild(btn)
    }
  } else if (el) {
    addNotice(el)
  }
}

/**
 * Initialize pulse component.
 * @param elems {Element[]} - Elements that invoke the pulse component.
 */

const initPulse = elems => {
  initPulseDemo()
  const el = elems && Array.isArray(elems) && elems.length > 0 ? elems[0] : null
  if (el) {
    addClass(el, 'initialized')

    // Start loop
    const jwt = Cookies.get('jwt')
    const timeout = getExpiration(jwt) - 120000
    setTimeout(async () => { await reauth(el) }, timeout)
  }
}

export default initPulse
