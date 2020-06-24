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
 * Flip the URL for the like/unlike link.
 * @param link {Element} - The like/unlike link.
 */

const flipURLs = link => {
  const href = link.getAttribute('href')
  const like = link.dataset ? link.dataset.like : null
  const unlike = link.dataset ? link.dataset.unlike : null
  if (hasClass(link, 'like') && href && unlike) {
    link.dataset.like = href
    link.setAttribute('href', unlike)
  } else if (hasClass(link, 'unlike') && href && like) {
    link.dataset.unlike = href
    link.setAttribute('href', like)
  }
}

/**
 * Update the page to reflect a like.
 * @param link {Element} - The link that was clicked to like the content.
 */

const like = link => {
  flipURLs(link)
  removeClass(link, 'like')
  addClass(link, 'unlike')
  link.innerText = 'Unlike'

  const { count, num } = getCount(link)
  if (!isNaN(num)) {
    count.innerText = num + 1
  }
}

/**
 * Update the page to reflect an unlike.
 * @param link {Element} - The link that was clicked to unlike the content.
 */

const unlike = link => {
  flipURLs(link)
  removeClass(link, 'unlike')
  addClass(link, 'like')
  link.innerText = 'Like'

  const { count, num } = getCount(link)
  if (!isNaN(num)) {
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
