export function loadImage (assets, filename) {
  return assets
    .file(filename)
    .then(asset => asset.read())
    .then(arrayBuffer => new Blob([arrayBuffer]))
    .then(blob => URL.createObjectURL(blob))
    .then(
      src =>
        new Promise((resolve, reject) => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.onerror = reject
          image.src = src
        })
    )
}

export default loadImage
