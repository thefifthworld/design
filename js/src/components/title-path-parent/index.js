const initTitlePathParent = () => {
  const form = document.querySelector('.thefifthworld form.page, form.page.thefifthworld')
  const title = form.querySelector('input[name="title"]')
  const path = form.querySelector('input[name="path"]')
  const parent = form.querySelector('input[name="parent"]')
  console.log({ form, title, path, parent })
}

export default initTitlePathParent
