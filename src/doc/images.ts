export interface DocumentImage {
  id: string
  name: string
  scale: number
  file: Blob
}

export const imageTypes = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
} as const

export function isImageType(type: string): type is keyof typeof imageTypes {
  return Object.hasOwn(imageTypes, type)
}

export async function validateImage(file: Blob): Promise<void> {
  if (!isImageType(file.type)) {
    throw new Error('Only PNG, JPEG, GIF, and WebP images are supported.')
  }
  const url = URL.createObjectURL(file)
  try {
    await new Promise<void>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('An image could not be decoded.'))
      image.src = url
    })
  } finally {
    URL.revokeObjectURL(url)
  }
}
