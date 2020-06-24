import { closest, select, hasClass, addClass, removeClass } from '../../utils'

/**
 * Return the count element and the number inside it associated with a
 * particular like/unlike link.
 * @param link {Element} - The like/unlike link.
 * @returns {{num: number, count: null}} - An object containing the number
 *   currently shown in the `count` span and the span itself.
 */

const getCount = link => {
  const wrapper = closest(link, '.likes')
  const count = wrapper ? wrapper.querySelector('.count') : null
  const num = count ? parseInt(count.innerText) : NaN
  return { count, num }
}

/**
 * Update the page to reflect a like.
 * @param link {Element} - The link that was clicked to like the content.
 */

const like = link => {
  const { count, num } = getCount(link)
  if (!isNaN(num)) {
    removeClass(link, 'like')
    addClass(link, 'unlike')
    link.innerText = 'Unlike'
    count.innerText = num + 1
  }
}

/**
 * Update the page to reflect an unlike.
 * @param link {Element} - The link that was clicked to unlike the content.
 */

const unlike = link => {
  const { count, num } = getCount(link)
  if (!isNaN(num)) {
    removeClass(link, 'unlike')
    addClass(link, 'like')
    link.innerText = 'Like'
    count.innerText = num - 1
  }
}

/**
 * Handle the click event on the like/unlike links.
 * @param event {Object} - The click event object.
 */

const handleClick = async event => {
  const a = event.target
  const isLike = hasClass(a, 'like')
  const isUnlike = hasClass(a, 'unlike')
  if (isLike || isUnlike) {
    event.preventDefault()
    const url = a.getAttribute('href')
    if (url) {
      if (isLike) like(a)
      if (isUnlike) unlike(a)
     }
  }
}

/**
 * Initialize like/unlike links.
 */

const initLikes = () => {
  const likes = select('.likes')
  likes.forEach(wrapper => {
    const link = wrapper.querySelector('a.like, a.unlike')
    if (link) link.addEventListener('click', handleClick)
  })
}

export default initLikes
