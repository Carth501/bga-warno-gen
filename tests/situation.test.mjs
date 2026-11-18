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
  const headers = [...html.matchAll(/<span class="([^"]*sec-title[^"]*)">(SITUATION|MISSION|GENERAL ORDERS|SUSTAINMENT|COMMAND AND SIGNAL)<\/span>/g)]
  assert.equal(headers.length, 5)
  assert.ok(headers.every((header) => header[1] === headers[0][1]))
  assert.match(html, /AREA OF OPERATION.*North sector/)
  assert.match(html, /ENEMY PRESENCE.*First line\nSecond line/)
  assert.match(html, /FRIENDLY PERSONNEL.*Friendly units/)
  assert.match(html, /CIVILIAN STATUS.*Evacuated/)
})

test('Command and Signal follows Sustainment and displays multiline fields', () => {
  const data = {
    values: {
      chainOfCommand: 'Commander\nDeputy',
      commsNets: 'Primary net',
      smokeAndSignals: 'Green smoke',
      codewords: 'Codeword alpha',
      sundialProcedure: 'Report position',
    },
    lists: {},
  }
  const html = renderToStaticMarkup(createElement(Document, { data, images: [] }))
  const sustainment = html.indexOf('>SUSTAINMENT</span>')
  const command = html.indexOf('>COMMAND AND SIGNAL</span>')
  assert.ok(sustainment !== -1 && command > sustainment)
  assert.match(html, /CHAIN OF COMMAND.*Commander\nDeputy/)
  assert.match(html, /COMMS NETS.*Primary net/)
  assert.match(html, /SMOKE &amp; SIGNALS.*Green smoke/)
  assert.match(html, /CODEWORDS.*Codeword alpha/)
  assert.match(html, /SUNDIAL PROCEDURE.*Report position/)

  const form = renderToStaticMarkup(createElement(SchemaForm, {
    data,
    images: [],
    onChange() {},
    onImagesChange() {},
    onPrint() {},
    onReset() {},
  }))
  const sustainmentForm = form.indexOf('06 Sustainment')
  const commandForm = form.indexOf('07 Command and Signal')
  assert.ok(sustainmentForm !== -1 && commandForm > sustainmentForm)
  for (const label of ['Chain of Command', 'Comms Nets', 'Smoke &amp; Signals', 'Codewords', 'Sundial Procedure']) {
    assert.ok(form.includes(`${label}<textarea`))
  }
})

test('General Orders appears between Mission and Sustainment with the requested fields', () => {
  const data = {
    values: {
      timeline: '0600',
      tasks: 'First task\nSecond task',
      coordinationInstruction: 'Coordinate\nwith command',
    },
    lists: {},
  }
  const html = renderToStaticMarkup(createElement(Document, { data, images: [] }))
  const mission = html.indexOf('>MISSION</span>')
  const orders = html.indexOf('>GENERAL ORDERS</span>')
  const sustainment = html.indexOf('>SUSTAINMENT</span>')
  assert.ok(mission !== -1 && mission < orders && orders < sustainment)
  assert.match(html, /TIMELINE.*0600/)
  assert.match(html, /TASKS.*First task\nSecond task/)
  assert.match(html, /COORDINATION INSTRUCTION.*Coordinate\nwith command/)

  const form = renderToStaticMarkup(createElement(SchemaForm, {
    data,
    images: [],
    onChange() {},
    onImagesChange() {},
    onPrint() {},
    onReset() {},
  }))
  assert.ok(form.indexOf('02 Mission') < form.indexOf('03 General Orders'))
  assert.ok(form.indexOf('03 General Orders') < form.indexOf('06 Sustainment'))
  assert.match(form, /Timeline<input type="text"/)
  assert.ok(form.includes('Tasks<textarea'))
  assert.ok(form.includes('Coordination Instruction<textarea'))
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
