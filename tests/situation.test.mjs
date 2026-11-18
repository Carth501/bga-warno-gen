import assert from 'node:assert/strict'
import { after, test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const server = await createServer({ server: { middlewareMode: true, ws: false }, appType: 'custom' })
after(() => server.close())
const { Document } = await server.ssrLoadModule('/src/doc/Document.tsx')
const { SchemaForm } = await server.ssrLoadModule('/src/components/SchemaForm.tsx')

test('Situation fields appear before Mission and preserve multiline values', () => {
  const data = {
    values: {
      areaOfOperation: 'North sector',
      enemyPresence: 'First line\nSecond line',
      friendlyPersonnel: 'Friendly units',
      civilianStatus: 'Evacuated',
    },
    lists: {},
  }
  const html = renderToStaticMarkup(createElement(Document, { data, images: [] }))
  assert.ok(html.indexOf('>SITUATION</span>') < html.indexOf('>MISSION</span>'))
  assert.match(html, /AREA OF OPERATION.*North sector/)
  assert.match(html, /ENEMY PRESENCE.*First line\nSecond line/)
  assert.match(html, /FRIENDLY PERSONNEL.*Friendly units/)
  assert.match(html, /CIVILIAN STATUS.*Evacuated/)
})

test('Situation editor uses a text input and three textareas', () => {
  const html = renderToStaticMarkup(createElement(SchemaForm, {
    data: { values: {}, lists: {} },
    images: [],
    onChange() {},
    onImagesChange() {},
    onPrint() {},
    onReset() {},
  }))
  assert.ok(html.indexOf('01 Situation') < html.indexOf('02 Mission'))
  assert.match(html, /Area of Operation<input type="text"/)
  for (const label of ['Enemy Presence', 'Friendly Personnel', 'Civilian status']) {
    assert.ok(html.includes(`${label}<textarea`))
  }
})
