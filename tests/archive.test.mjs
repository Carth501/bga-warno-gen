import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import JSZip from 'jszip'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
after(() => server.close())
const { createArchive, readDocument } = await server.ssrLoadModule('/src/services/archive.ts')

const data = {
  values: { clearance: 'III', opName: 'Test operation' },
  lists: { objectives: [{ id: 'one', tier: 'pri', title: 'Objective', body: 'Details' }] },
}

test('ZIP round trip preserves form data, ordered image metadata, and original bytes', async () => {
  const originalImage = globalThis.Image
  globalThis.Image = class {
    set src(_) { queueMicrotask(() => this.onload()) }
  }
  try {
    const images = [
      { id: 'a', name: 'First', scale: 25, file: new Blob(['first'], { type: 'image/png' }) },
      { id: 'b', name: 'Second', scale: 100, file: new Blob(['second'], { type: 'image/jpeg' }) },
    ]
    const archive = await createArchive(data, images)
    const restored = await readDocument(new File([archive], 'opord.zip'))
    assert.deepEqual(restored.data, data)
    assert.deepEqual(restored.images.map(({ name, scale, file }) => [name, scale, file.type]), [
      ['First', 25, 'image/png'],
      ['Second', 100, 'image/jpeg'],
    ])
    assert.deepEqual(await Promise.all(restored.images.map(({ file }) => file.text())), ['first', 'second'])
  } finally {
    globalThis.Image = originalImage
  }
})

test('legacy JSON and image-free ZIP files import without images', async () => {
  const legacy = await readDocument(new File([JSON.stringify(data)], 'legacy.json'))
  const archive = await createArchive(data, [])
  const restored = await readDocument(new File([archive], 'opord.zip'))
  assert.deepEqual(legacy, { data, images: [] })
  assert.deepEqual(restored, { data, images: [] })
  const partial = await readDocument(new File([JSON.stringify({ values: {}, lists: {} })], 'legacy.json'))
  assert.equal(partial.data.values.clearance, 'III')
})

test('invalid documents, invalid scale, and missing image files are rejected', async () => {
  await assert.rejects(readDocument(new File(['{}'], 'bad.json')), /invalid format/)
  await assert.rejects(readDocument(new File(['bad'], 'bad.zip')), /invalid or damaged/)

  const zip = new JSZip()
  const entry = { name: 'Map', scale: 25, type: 'image/png', path: 'images/1.png' }
  zip.file('opord.json', JSON.stringify({ version: 1, data, images: [entry] }))
  const missing = await zip.generateAsync({ type: 'uint8array' })
  await assert.rejects(readDocument(new File([missing], 'missing.zip')), /missing images\/1\.png/)

  entry.scale = 24
  zip.file('opord.json', JSON.stringify({ version: 1, data, images: [entry] }))
  const invalidScale = await zip.generateAsync({ type: 'uint8array' })
  await assert.rejects(readDocument(new File([invalidScale], 'scale.zip')), /invalid format/)
})
