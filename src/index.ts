import { Media, MediaStore, MediaList, MediaUploadOptions } from '@tinacms/core'

const PLACECAGE_HOST = 'https://www.placecage.com/'

const TYPES = {
  calm: null,
  gray: 'g',
  crazy: 'c',
  gif: 'gif',
}

export class PlacecageMediaStore implements MediaStore {
  accept = '*'
  constructor(public maxDim: number = 500) {}

  async persist(files: MediaUploadOptions[]) {
    return generateCage({ count: files.length, maxDim: this.maxDim })
  }

  async delete() {
    // You can't delete the cage
  }

  async previewSrc(src: string) {
    return src
  }

  async list() {
    const limit = 10
    const list: MediaList = {
      items: generateCage({ count: limit, maxDim: this.maxDim }),
      offset: 0,
      limit,
      totalCount: limit,
    }

    return list
  }
}

function generateCage({
  count,
  maxDim,
}: {
  count?: number
  maxDim: number
}): Media[] {
  return [...new Array(count)].map(() => {
    const config: any = []

    const type = getType()

    if (type !== TYPES.calm) {
      config.push(type)
    }

    config.push(...randomDimensions(maxDim))

    const url = `${PLACECAGE_HOST}${config.join('/')}`

    return {
      id: url,
      directory: '',
      filename: '',
      previewSrc: url,
      type: 'file',
    }
  })
}

function randomDimensions(maxDim: number) {
  const width = Math.floor(Math.random() * maxDim + 100)
  const height = Math.floor(Math.random() * maxDim + 100)
  return [width, height]
}

function getType() {
  const i = Math.floor(Math.random() * 4 + 1)
  switch (i % 4) {
    case 0:
      return TYPES.calm
    case 1:
      return TYPES.crazy
    case 2:
      return TYPES.gif
    case 3:
      return TYPES.gray
    default:
      return TYPES.calm
  }
}
