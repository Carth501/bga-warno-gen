import { sections, newRow, type Field, type ListField, type OpordData, type SelectField, type TextField } from '../doc/schema'
import { exportJson } from '../services/export'

interface Props {
  data: OpordData
  onChange: (data: OpordData) => void
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

export function SchemaForm({ data, onChange, onPrint, onReset }: Props) {
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
      <div className="actions">
        <button type="button" className="primary" onClick={onPrint}>
          Print / Save PDF
        </button>
        <button type="button" onClick={() => exportJson(data, 'opord.json')}>
          Export JSON
        </button>
        <button type="button" onClick={onReset}>
          Reset
        </button>
      </div>
      {sections.map((s) => (
        <details key={s.id} open>
          <summary>{s.title}</summary>
          <div className="section-fields">{s.fields.map(renderField)}</div>
        </details>
      ))}
    </form>
  )
}
