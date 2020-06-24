import { select, hasClass } from '../../utils'

/**
 * Handle the click event on the like/unlike links.
 * @param event {Object} - The click event object.
 */

const handleClick = event => {
  const a = event.target
  if (hasClass(a, 'like', 'unlike')) {
    event.preventDefault()
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
