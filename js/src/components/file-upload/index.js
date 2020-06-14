import { select, create, closest, next, addClass } from '../../utils'

const initThumbnailer = input => {
  const thumbnailer = create('p', [ 'thumbnailer' ], null, 'Thumbnailer goes here')
  input.insertAdjacentElement('afterend', thumbnailer)
}

const destroyThumbnailer = input => {
  const thumbnailer = next(input, '.thumbnailer')
  if (thumbnailer) thumbnailer.parentNode.removeChild(thumbnailer)
}

const stop = event => {
  event.preventDefault()
  event.stopPropagation()
}

const drop = event => {
  stop(event)
  const label = closest(event.target, 'label')
  const id = label.getAttribute('for')
  const input = document.getElementById(id)
  input.files = event.dataTransfer.files
  if (input.files.length > 0 && input.files[0].type.startsWith('image/')) {
    initThumbnailer(label)
  } else {
    destroyThumbnailer(label)
  }
}

const initFileUploads = () => {
  const validFormSelector = 'form[action][method="POST"][enctype="multipart/form-data"]'
  const inputs = select(`${validFormSelector} input[type="file"]:not(.initialized)`)
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

    // Set up drag and drop
    label.addEventListener('drop', drop)
    label.addEventListener('dragenter', stop)
    label.addEventListener('dragleave', stop)
    label.addEventListener('dragover', stop)
  })
}

export default initFileUploads
