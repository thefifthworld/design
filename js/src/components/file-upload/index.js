import Cropper from 'cropperjs'
import { select, create, closest, nextMatching, addClass } from '../../utils'

/**
 * Initialize thumbnailer.
 * @param label {Element} - The drag-and-drop element that this thumbnailer is
 *   paired with.
 */

const initThumbnailer = (label, img) => {
  if (FileReader && img) {
    const reader = new FileReader()
    reader.onload = () => {
      const id = label.getAttribute('for')
      const attrs = { src: reader.result, 'data-cropper': id }
      const thumbnailer = create('img', [ 'thumbnailer' ], attrs)
      const input = create('input', ['initialized'], { name: 'thumbnail', type: 'file' })
      label.insertAdjacentElement('afterend', thumbnailer)
      thumbnailer.insertAdjacentElement('afterend', input)
      const opts = {
        aspectRatio: 1,
        center: false,
        guides: false
      }
      const cropper = new Cropper(thumbnailer, opts)
      window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id] = cropper
    }
    reader.readAsDataURL(img)
  }
}

/**
 * Tear down a thumbnailer.
 * @param label {Element} - The drag-and-drop element that this thumbnailer is
 *   paired with.
 */

const destroyThumbnailer = label => {
  const thumbnailer = nextMatching(label, '.thumbnailer')
  const input = nextMatching(label, 'input[type="file"][name="thumbnail"].initialized')
  if (thumbnailer) {
    const id = label.getAttribute('for')
    if (window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id]) window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id].destroy()
    thumbnailer.parentNode.removeChild(thumbnailer)
  }
  if (input) input.parentNode.removeChild(input)
}

/**
 * Stop an event's default behavior and propagation.
 * @param event {Object} - The event to stop.
 */

const stop = event => {
  event.preventDefault()
  event.stopPropagation()
}

/**
 * Event handler for the drop event.
 * @param event {Object} - The drop event.
 */

const drop = event => {
  stop(event)
  const label = closest(event.target, 'label')
  const id = label.getAttribute('for')
  const input = document.getElementById(id)
  input.files = event.dataTransfer.files
  if (input.files.length > 0 && input.files[0].type.startsWith('image/')) {
    initThumbnailer(label, input.files[0])
  } else {
    destroyThumbnailer(label)
  }
}

/**
 * Turn a canvas into a file.
 * @param canvas {HTMLCanvasElement} - An HTML canvas element.
 * @param filename {string} - The filename to use for the file created.
 * @returns {Promise<File>} - A PNG file created from the canvas.
 */

const getFileFromCanvas = (canvas, filename) => {
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      blob.lastModifiedDate = new Date()
      blob.fileName = filename
      resolve(blob)
    })
  })
}

/**
 * Run form submission with thumbnail handling.
 * @param event {Object} - The event object.
 * @returns {Promise<void>} - A Promise that resolves when the form has been
 *   submitted.
 */

const submit = async event => {
  stop(event)
  const data = new FormData(event.target)
  const files = Array.from(event.target.querySelectorAll('input[type="file"]'))
  for (const file of files) {
    const id = file.getAttribute('id')
    if (window.__THEFIFTHWORLD_FILEUPLOADS__[id]) {
      const canvas = window.__THEFIFTHWORLD_FILEUPLOADS__[id].getCroppedCanvas({ height: 256, width: 256, imageSmoothingQuality: 'high' })
      const thumbnail = await getFileFromCanvas(canvas, 'thumbnail.png')
      data.append('thumbnail', thumbnail)
    }
  }

  const request = new XMLHttpRequest()

  request.addEventListener('load', event => {
    const res = JSON.parse(event.target.responseText)
    const { protocol, hostname, port } = window.location
    const base = port !== '' ? `${protocol}://${hostname}:${port}` : `${protocol}://${hostname}`
    if (res.page.path) window.location.href = `${base}${res.page.path}`
  })

  request.open('POST', event.target.getAttribute('action'))
  request.send(data)
}

/**
 * Initialize file upload components.
 */

const initFileUploads = () => {
  window.__THEFIFTHWORLD_FILEUPLOADS__ = { croppers: {} }
  const validFormSelector = 'form[action][method="POST"][enctype="multipart/form-data"]'
  const inputs = select(`${validFormSelector} input[type="file"]:not(.initialized)`)
  inputs.forEach((input, index) => {
    const id = input.getAttribute('id') || `file-upload-${index + 1}`
    input.setAttribute('id', id)
    addClass(input, 'initialized')

    // Set up form submission
    const form = closest(input, validFormSelector)
    if (form) form.addEventListener('submit', submit)

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