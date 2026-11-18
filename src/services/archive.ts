import JSZip from 'jszip'
import { imageTypes, isImageType, validateImage, type DocumentImage } from '../doc/images'
import { makeDefaults, type OpordData } from '../doc/schema'

interface ImageEntry {
  name: string
  scale: number
  path: string
  type: keyof typeof imageTypes
}

interface ArchiveManifest {
  version: 1
  data: OpordData
  images: ImageEntry[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isOpordData(value: unknown): value is OpordData {
  if (!isRecord(value) || !isRecord(value.values) || !isRecord(value.lists)) return false
  if (!Object.values(value.values).every((item) => typeof item === 'string')) return false
  return Object.values(value.lists).every((list) => {
    if (!Array.isArray(list)) return false
    const ids = new Set<string>()
    return list.every((row: unknown) => {
      if (!isRecord(row) || typeof row.id !== 'string' || !row.id || ids.has(row.id)) return false
      ids.add(row.id)
      return Object.values(row).every((item) => typeof item === 'string')
    })
  })
}

function isImageEntry(value: unknown): value is ImageEntry {
  return isRecord(value) &&
    typeof value.name === 'string' &&
    typeof value.scale === 'number' && Number.isInteger(value.scale) && value.scale >= 25 && value.scale <= 100 &&
    typeof value.path === 'string' && /^images\/[1-9]\d*\.(png|jpg|gif|webp)$/.test(value.path) &&
    typeof value.type === 'string' && isImageType(value.type) &&
    value.path.endsWith(`.${imageTypes[value.type]}`)
}

function isManifest(value: unknown): value is ArchiveManifest {
  return isRecord(value) && value.version === 1 && isOpordData(value.data) &&
    Array.isArray(value.images) && value.images.every(isImageEntry) &&
    new Set(value.images.map((image: ImageEntry) => image.path)).size === value.images.length
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('The document contains invalid JSON.')
  }
}

function withDefaults(data: OpordData): OpordData {
  return { ...data, values: { ...makeDefaults().values, ...data.values } }
}

export async function createArchive(data: OpordData, images: DocumentImage[]): Promise<Blob> {
  const zip = new JSZip()
  const entries = await Promise.all(images.map(async (image, index): Promise<ImageEntry> => {
    if (!isImageType(image.file.type)) throw new Error('An image has an unsupported type.')
    const path = `images/${index + 1}.${imageTypes[image.file.type]}`
    zip.file(path, await image.file.arrayBuffer())
    return { name: image.name, scale: image.scale, path, type: image.file.type }
  }))
  const manifest: ArchiveManifest = { version: 1, data, images: entries }
  zip.file('opord.json', JSON.stringify(manifest, null, 2))
  return zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
}

export async function readDocument(file: File): Promise<{ data: OpordData; images: DocumentImage[] }> {
  if (file.name.toLowerCase().endsWith('.json')) {
    const data = parseJson(await file.text())
    if (!isOpordData(data)) throw new Error('The JSON document has an invalid format.')
    return { data: withDefaults(data), images: [] }
  }
  if (!file.name.toLowerCase().endsWith('.zip')) {
    throw new Error('Choose a ZIP archive or a legacy JSON document.')
  }
  let zip: JSZip
  try {
    zip = await JSZip.loadAsync(await file.arrayBuffer(), { checkCRC32: true })
  } catch {
    throw new Error('The ZIP archive is invalid or damaged.')
  }
  const manifestFile = zip.file('opord.json')
  if (!manifestFile) throw new Error('The ZIP archive is missing opord.json.')
  const manifest = parseJson(await manifestFile.async('string'))
  if (!isManifest(manifest)) throw new Error('The ZIP document has an invalid format.')
  const images = await Promise.all(manifest.images.map(async (entry): Promise<DocumentImage> => {
    const imageFile = zip.file(entry.path)
    if (!imageFile) throw new Error(`The ZIP archive is missing ${entry.path}.`)
    const bytes = await imageFile.async('arraybuffer')
    const file = new Blob([bytes], { type: entry.type })
    await validateImage(file)
    return { id: crypto.randomUUID(), name: entry.name, scale: entry.scale, file }
  }))
  return { data: withDefaults(manifest.data), images }
}

export async function downloadArchive(data: OpordData, images: DocumentImage[]): Promise<void> {
  const blob = await createArchive(data, images)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'opord.zip'
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
