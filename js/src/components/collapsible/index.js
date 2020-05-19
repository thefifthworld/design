import { select, create, addClass, removeClass, hasClass } from '../../utils'

const handleToggle = event => {
  const heading = event.target
  const fn = hasClass(heading, 'open') ? removeClass : addClass
  fn(heading, 'open')
}

const initCollapsibles = async () => {
  const collapsibles = select('.collapsible')
  collapsibles.forEach(collapsible => {
    const heading = collapsible.querySelector('h1, h2, h3, h4, h5, h6')
    if (heading) {
      const toggle = create(heading.tagName.toLowerCase(), ['toggle'], undefined, heading.innerHTML)
      const wrapper = create('div', ['togglable'])
      collapsible.childNodes.forEach(child => {
        if (child !== heading) {
          wrapper.appendChild(child.cloneNode(true))
        }
      })

      collapsible.innerHTML = ''
      collapsible.appendChild(toggle)
      collapsible.appendChild(wrapper)
      toggle.addEventListener('click', handleToggle)
    }
  })
}

export default initCollapsibles
