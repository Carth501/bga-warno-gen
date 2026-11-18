import { useEffect, useRef, useState } from 'react'
import './App.css'
import { SchemaForm } from './components/SchemaForm'
import { Document } from './doc/Document'
import type { DocumentImage } from './doc/images'
import { makeDefaults, type OpordData } from './doc/schema'
import { useLocalStorage } from './hooks/useLocalStorage'

export default function App() {
  const [data, setData] = useLocalStorage<OpordData>('opord-form', makeDefaults())
  const [images, setImages] = useState<DocumentImage[]>([])

  const [width, setWidth] = useState<number>(() => {
    const saved = Number(localStorage.getItem('form-pane-width'))
    return saved >= 280 ? saved : 420
  })
  const dragging = useRef(false)

  useEffect(() => {
    localStorage.setItem('form-pane-width', String(width))
  }, [width])

  return (
    <div className="layout" style={{ gridTemplateColumns: `${width}px 6px 1fr` }}>
      <aside className="pane form-pane">
        <SchemaForm
          data={data}
          onChange={setData}
          images={images}
          onImagesChange={setImages}
          onPrint={() => window.print()}
          onReset={() => {
            setData(makeDefaults())
            setImages([])
          }}
        />
      </aside>
      <div
        className="resizer"
        role="separator"
        aria-orientation="vertical"
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture(e.pointerId)
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return
          setWidth(Math.min(Math.max(e.clientX, 280), window.innerWidth - 300))
        }}
        onPointerUp={() => {
          dragging.current = false
        }}
      />
      <main className="pane preview-pane">
        <Document data={data} images={images} />
      </main>
    </div>
  )
}
