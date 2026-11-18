import { useRef, useState } from 'react'
import { sections, newRow, type Field, type ListField, type OpordData, type SelectField, type TextField } from '../doc/schema'
import { validateImage, type DocumentImage } from '../doc/images'
import { downloadArchive, readDocument } from '../services/archive'

interface Props {
  data: OpordData
  onChange: (data: OpordData) => void
  images: DocumentImage[]
  onImagesChange: (images: DocumentImage[]) => void
  onPrint: () => void
  onReset: () => void
}

type Leaf = TextField | SelectField

function Input(props: { field: Leaf; value: string; onChange: (v: string) => void }) {
  const { field, value, onChange } = props
  if (field.kind === 'textarea') {
    return <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} />
  }
  if (field.kind === 'select') {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )
  }
  return <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
}

export function SchemaForm({ data, onChange, images, onImagesChange, onPrint, onReset }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const importInput = useRef<HTMLInputElement>(null)

  const run = async (action: () => Promise<void>) => {
    setBusy(true)
    setError('')
    try {
      await action()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'The operation failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const uploadImages = (files: File[]) => run(async () => {
    const added = await Promise.all(files.map(async (file): Promise<DocumentImage> => {
      await validateImage(file)
      return {
        id: crypto.randomUUID(),
        name: file.name.replace(/\.[^.]+$/, ''),
        scale: 100,
        file,
      }
    }))
    onImagesChange([...images, ...added])
  })

  const importDocument = (file: File) => run(async () => {
    const imported = await readDocument(file)
    if (!window.confirm('Replace the current document and images with the imported file?')) return
    onChange(imported.data)
    onImagesChange(imported.images)
  })

  const moveImage = (index: number, direction: -1 | 1) => {
    const reordered = [...images]
    const target = index + direction
    if (target < 0 || target >= reordered.length) return
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    onImagesChange(reordered)
  }

  const renderImages = () => (
    <fieldset key="images">
      <legend>Images</legend>
      <p className="image-note">Images are kept only until this page is reloaded or closed. Export a ZIP to keep them.</p>
      <label>
        Upload images (PNG, JPEG, GIF, or WebP)
        <input
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp"
          multiple
          onChange={(e) => {
            const files = Array.from(e.currentTarget.files ?? [])
            e.currentTarget.value = ''
            if (files.length) void uploadImages(files)
          }}
        />
      </label>
      {images.map((image, i) => (
        <div className="list-row" key={image.id}>
          <div className="list-row-head">
            <span>Image #{i + 1}</span>
            <div className="image-actions">
              <button type="button" disabled={i === 0} onClick={() => moveImage(i, -1)} aria-label={`Move image ${i + 1} up`}>Up</button>
              <button type="button" disabled={i === images.length - 1} onClick={() => moveImage(i, 1)} aria-label={`Move image ${i + 1} down`}>Down</button>
              <button type="button" onClick={() => onImagesChange(images.filter((item) => item.id !== image.id))}>Remove</button>
            </div>
          </div>
          <label>
            Caption
            <input type="text" value={image.name} onChange={(e) => onImagesChange(images.map((item) =>
              item.id === image.id ? { ...item, name: e.target.value } : item
            ))} />
          </label>
          <label>
            Display width: {image.scale}%
            <input type="range" min="25" max="100" step="1" value={image.scale} onChange={(e) => onImagesChange(images.map((item) =>
              item.id === image.id ? { ...item, scale: Number(e.target.value) } : item
            ))} />
          </label>
        </div>
      ))}
    </fieldset>
  )

  const setValue = (key: string, v: string) =>
    onChange({ ...data, values: { ...data.values, [key]: v } })

  const setRows = (key: string, rows: OpordData['lists'][keyof OpordData['lists']]) =>
    onChange({ ...data, lists: { ...data.lists, [key]: rows } })

  const renderList = (field: ListField) => {
    const rows = data.lists[field.key as keyof OpordData['lists']] ?? []
    return (
      <fieldset key={field.key}>
        <legend>{field.label}</legend>
        {rows.map((row, i) => (
          <div className="list-row" key={row.id}>
            <div className="list-row-head">
              <span>#{i + 1}</span>
              <button type="button" onClick={() => setRows(field.key, rows.filter((r) => r.id !== row.id))}>
                Remove
              </button>
            </div>
            {field.itemFields.map((f) => (
              <label key={f.key}>
                {f.label}
                <Input
                  field={f}
                  value={row[f.key] ?? ''}
                  onChange={(v) =>
                    setRows(field.key, rows.map((r) => (r.id === row.id ? { ...r, [f.key]: v } : r)))
                  }
                />
              </label>
            ))}
          </div>
        ))}
        <button type="button" onClick={() => setRows(field.key, [...rows, newRow(field)])}>
          {field.addLabel}
        </button>
      </fieldset>
    )
  }

  const renderField = (field: Field) => {
    if (field.kind === 'list') return renderList(field)
    const value = data.values[field.key as keyof OpordData['values']] ?? ''
    return (
      <label key={field.key}>
        {field.label}
        <Input field={field} value={value} onChange={(v) => setValue(field.key, v)} />
      </label>
    )
  }

  return (
    <form className="form" onSubmit={(e) => e.preventDefault()}>
      <fieldset className="form-content" disabled={busy}>
      <div className="actions">
        <button type="button" className="primary" onClick={onPrint}>
          Print / Save PDF
        </button>
        <button type="button" onClick={() => void run(() => downloadArchive(data, images))}>
          Export ZIP
        </button>
        <button type="button" onClick={() => importInput.current?.click()}>
          Import
        </button>
        <input ref={importInput} type="file" accept=".zip,.json,application/zip,application/json" hidden onChange={(e) => {
          const file = e.currentTarget.files?.[0]
          e.currentTarget.value = ''
          if (file) void importDocument(file)
        }} />
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {sections.map((s) => (
        <details key={s.id} open>
          <summary>{s.title}</summary>
          <div className="section-fields">{s.fields.map((field) => (
            field.key === 'objectives' ? [renderField(field), renderImages()] : renderField(field)
          ))}</div>
        </details>
      ))}
      </fieldset>
    </form>
  )
}
