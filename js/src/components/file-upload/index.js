import { select, create, closest, addClass } from '../../utils'

const submit = event => {
  event.preventDefault()
  console.log('what up')
}

const initFileUploads = () => {
  const inputs = select('form[action] input[type="file"]:not(.initialized)')
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id') || `file-upload-${index + 1}`
    input.setAttribute('id', id)
    addClass(input, 'initialized')

    // Remove any label that might have existed before.
    const oldLabel = id ? document.querySelector(`label[for="${id}"]`) : null
    if (oldLabel) oldLabel.parentNode.removeChild(oldLabel)

    // Add our drag-and-drop label
    const label = create('label', [ 'drag-and-drop' ], { for: id }, ' or drag it here')
    const strong = create('strong', null, null, 'Choose a file')
    label.insertBefore(strong, label.firstChild)
    input.insertAdjacentElement('afterend', label)

    // Set up form handling
    const form = closest(input, 'form[action]')
    if (form) form.addEventListener('submit', submit)
  })
}

export default initFileUploads
