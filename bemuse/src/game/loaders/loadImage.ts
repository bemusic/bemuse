import { Assets } from './game-loader'

export type LoadImagePromise = Promise<HTMLImageElement>

export async function loadImage(
  assets: Assets,
  filename: string
): LoadImagePromise {
  const asset = await assets.file(filename)
  const arrayBuffer = await asset.read()
  const blob = new Blob([arrayBuffer])
  const src = URL.createObjectURL(blob)
  return await new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

export default loadImage
