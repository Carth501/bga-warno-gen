import { createContext, useContext } from 'react'
import { findField, type ListKey, type OpordData, type Row, type ValueKey } from './schema'

export const DocContext = createContext<OpordData>({ values: {}, lists: {} })

export const useDoc = () => useContext(DocContext)

export function useList(key: ListKey): Row[] {
  return useDoc().lists[key] ?? []
}

// Renders a variable value, or a gold dashed blank labelled from the schema when empty.
export function Val({ k }: { k: ValueKey }) {
  const value = useDoc().values[k]?.trim()
  if (value) return <>{value}</>
  const label = findField(k)?.label ?? k
  return <span className="blank">[{label.toUpperCase()}]</span>
}

// Same as Val but preserves line breaks, for multi-line fields.
export function MultiVal({ k }: { k: ValueKey }) {
  const value = useDoc().values[k]?.trim()
  if (!value) return <Val k={k} />
  return <span className="ml">{value}</span>
}
