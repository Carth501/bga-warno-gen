import './App.css'
import { SchemaForm } from './components/SchemaForm'
import { Document } from './doc/Document'
import { makeDefaults, type OpordData } from './doc/schema'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [data, setData] = useLocalStorage<OpordData>('opord-form', makeDefaults())

  return (
    <div className="layout">
      <aside className="pane form-pane">
        <SchemaForm
          data={data}
          onChange={setData}
          onPrint={() => window.print()}
          onReset={() => setData(makeDefaults())}
        />
      </aside>
      <main className="pane preview-pane">
        <Document data={data} />
      </main>
    </div>
  )
}
