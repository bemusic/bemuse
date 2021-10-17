import BemusePackageResources from 'bemuse/resources/bemuse-package'
import { resolveRelativeResources } from 'bemuse/resources/resolveRelativeResource'
import { IResources } from 'bemuse/resources/types'
import { URLResources } from 'bemuse/resources/url'
import { Song } from 'bemuse/collection-model/types'

export function getSongResources(
  song: Song,
  serverUrl: string
): {
  /** The base resources for loading chart files, song previews. */
  baseResources: IResources

  /** The resources for loading sound file assets. */
  assetResources: IResources
} {
  const baseResources =
    song.resources ||
    new URLResources(
      new URL(song.path.replace(/\/?$/, '/'), serverUrl.replace(/\/?$/, '/'))
    )
  const assetResources = wrapAssetResources(baseResources, song.bemusepack_url)
  return { baseResources, assetResources }
}

function wrapAssetResources(
  base: IResources,
  bemusepackUrl: string | null | undefined
): IResources {
  if (bemusepackUrl === null) {
    return base
  }
  if (bemusepackUrl === undefined) {
    bemusepackUrl = 'assets/metadata.json'
  }
  const [assetsBase, metadataFilename] = resolveRelativeResources(
    base,
    bemusepackUrl
  )
  return new BemusePackageResources(assetsBase, {
    metadataFilename: metadataFilename,
    fallback: base,
    fallbackPattern: /\.(?:png|jpg|webm|mp4|m4v)/,
  })
}
