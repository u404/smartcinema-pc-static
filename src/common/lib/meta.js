const shareOptions = {
  type: "article",
  title: document.title,
  description: "",
  image: ""
}

// const getMetaHtml = (property, content) => {
//   return `<meta property="${property}" content="${content}" />`
// }

// const getShareMetas = (options, prefix = "") => {
//   return Object.keys(options).map(key => getMetaHtml(`${prefix}${key}`, options[key]))
// }

// export const setShareMetas = (options, prefix) => {
//   const opts = { ...shareOptions, ...options }
//   const defualtMetas = getShareMetas(opts)
//   const facebookMetas = getShareMetas(opts, "og:")
//   const twitterMetas = getShareMetas(opts, "twitter:")
//   const metas = defualtMetas.concat(facebookMetas).concat(twitterMetas)
//   document.head.innerHTML += metas.join("\n")
//   console.log(document.head)
// }

const appendMeta = (property, content) => {
  const meta = document.createElement("meta")
  meta.property = property
  meta.content = content
  document.head.appendChild(meta)
  return meta
}

const appendMetas = (options, prefix = "") => {
  Object.keys(options).forEach(key => appendMeta(`${prefix}${key}`, options[key]))
}

export const setShareMetas = (options) => {
  const opts = { ...shareOptions, ...options }
  appendMetas(opts)
  appendMetas(opts, "og:")
  appendMetas(opts, "twitter:")
}

export default {
  setShareMetas
}
