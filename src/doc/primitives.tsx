import type { ReactNode } from 'react'
import { clearanceLabel } from './schema'
import { useDoc } from './context'

type Tone = 'green' | 'gold' | 'red'

export function Section(props: {
  num: string
  title: string
  tone?: Tone
  tag?: ReactNode
  children: ReactNode
}) {
  const { num, title, tone, tag, children } = props
  const data = useDoc()
  const defaultTag = `${clearanceLabel(data).replace('LEVEL', 'CLEARANCE')} — CLASSIFIED`
  return (
    <div className="section">
      <div className="section-hdr">
        <span className="sec-num">{num}</span>
        <span className={`sec-title ${tone && tone !== 'green' ? tone : ''}`}>{title}</span>
        <span className="sec-tag">{tag ?? defaultTag}</span>
      </div>
      <div className="sec-body">{children}</div>
    </div>
  )
}

export function Field(props: { label: string; tone?: Tone; children: ReactNode }) {
  return (
    <div className="field">
      <div className="f-label">{props.label}</div>
      <div className={`f-val ${props.tone ?? ''}`}>{props.children}</div>
    </div>
  )
}

export function Grid({ cols, children }: { cols: 2 | 3 | 4; children: ReactNode }) {
  return <div className={`grid-${cols}`}>{children}</div>
}

export function Intel(props: { label: string; tone?: Tone; children: ReactNode }) {
  return (
    <div className={`intel ${props.tone ?? ''}`}>
      <div className="intel-lbl">{props.label}</div>
      {props.children}
    </div>
  )
}

export function Objective(props: { tier: string; n: number; children: ReactNode }) {
  const tier = ['pri', 'sec', 'ter'].includes(props.tier) ? props.tier : 'pri'
  return (
    <li className="obj">
      <span className={`obj-tag ${tier}`}>OBJECTIVE {props.n}</span>
      <div>{props.children}</div>
    </li>
  )
}
