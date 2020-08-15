/* global FileReader, FormData, XMLHttpRequest */

import Croppie from 'croppie'
import { create, closest, nextMatching, addClass } from '../../utils'

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
      const wrapper = create('div', ['thumbnailer'], { 'data-cropper': id })
      label.insertAdjacentElement('afterend', wrapper)

      const lbl = create('label', ['cropper'], null, 'Set thumbnail')
      const img = create('img', ['thumbnailer'], { src: reader.result })
      const inp = create('input', ['initialized'], { name: 'thumbnail', type: 'file' })
      wrapper.appendChild(lbl)
      wrapper.appendChild(img)
      wrapper.appendChild(inp)

      const crop = new Croppie(img, {
        boundary: { height: 356, width: 356 },
        viewport: { height: 256, width: 256 },
        showZoomer: true
      })
      window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id] = crop
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
  if (thumbnailer) {
    const id = thumbnailer.dataset ? thumbnailer.dataset.cropper : undefined
    if (id !== undefined && window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id]) {
      window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id].destroy()
      delete window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id]
    }
    thumbnailer.parentNode.removeChild(thumbnailer)
  }
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
  receive(label, input)
}

/**
 * Event handler for the file input event.
 * @param event {Objec} - The file input event.
 */

const choose = event => {
  const label = nextMatching(event.target, 'label')
  receive(label, event.target)
}

/**
 * Updates the label and the thumbnailer.
 * @param label {Element} - The label element.
 * @param input {Element} - The file input element.
 */

const receive = (label, input) => {
  label.innerHTML = `Uploading <strong>${input.files[0].name}</strong>`
  destroyThumbnailer(label)
  if (input.files.length > 0 && input.files[0].type.startsWith('image/')) {
    initThumbnailer(label, input.files[0])
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
      blob.name = filename
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

  // Some files will take a while to upload. Switch over to the loading style
  // so users know that something is happening.
  const button = event.target.querySelector('.page-actions button')
  if (button) {
    addClass(button, [ 'loading' ])
    button.setAttribute('disabled', 'disabled')
  }

  // Gather up the form data, including any possible thumbnail.
  const data = new FormData(event.target)
  data.delete('thumbnail')
  const files = Array.from(event.target.querySelectorAll('input[type="file"]'))
  for (const file of files) {
    const orig = file && file.files && file.files[0] && file.files[0].name ? file.files[0].name : undefined
    const base = orig ? orig.substr(0, orig.lastIndexOf('.')) : undefined
    const ext = orig ? orig.substr(orig.lastIndexOf('.')) : undefined
    const id = file.getAttribute('id')
    if (window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id]) {
      const blob = await window.__THEFIFTHWORLD_FILEUPLOADS__.croppers[id].result({ type: 'blob', format: 'jpeg', quality: 0.9 })
      blob.lastModifiedDate = new Date()
      blob.name = base && ext ? `${base}.thumbnail${ext}` : 'thumbnail.jpg'
      data.append('thumbnail', blob, blob.name)
    }
  }

  // Submit the form.
  const request = new XMLHttpRequest()
  request.addEventListener('load', event => {
    const url = event.target.responseURL
    if (url) window.location.href = url
  })
  request.open('POST', event.target.getAttribute('action'))
  request.send(data)
}

/**
 * Initialize file upload components.
 * @param validFormSelector {string} - The selector used to identify a form
 *   that could have a valid file input.
 * @param inputs {Element[]} - An array of the file inputs that should have
 *   their behavior enhanced.
 */

const initFileUploads = (validFormSelector, inputs) => {
  window.__THEFIFTHWORLD_FILEUPLOADS__ = { croppers: {} }
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
    const label = create('label', ['drag-and-drop'], { for: id }, ' or drag it here')
    const strong = create('strong', null, null, 'Choose a file')
    label.insertBefore(strong, label.firstChild)
    input.insertAdjacentElement('afterend', label)

    // Set up drag and drop
    label.addEventListener('drop', drop)
    label.addEventListener('dragenter', stop)
    label.addEventListener('dragleave', stop)
    label.addEventListener('dragover', stop)
    input.addEventListener('input', choose)
  })
}

export default initFileUploads
