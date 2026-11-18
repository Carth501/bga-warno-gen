import { Val } from '../context'
import { clearanceLabel } from '../schema'
import { useDoc } from '../context'

export function Banner() {
  const data = useDoc()
  return (
    <div className="classify-banner">
      {clearanceLabel(data)} — STATUS: CLASSIFIED — BATTLEGROUP ATHENS
    </div>
  )
}

export function Boot() {
  return (
    <div className="boot">
      Login: battle^group^athens
      <br />
      Access... <span>Granted</span>
      <br />
      Booting UNSC coms link V. 1.023 ... Loaded
      <br />
      Opening UNSC intelligence briefing 081 ... Access... <span>Granted</span>
    </div>
  )
}

export function Header() {
  const data = useDoc()
  return (
    <div className="doc-header">
      <div className="header-top">
        <div>
          <div className="unsc-title">UNSC — BATTLEGROUP ATHENS</div>
          <div className="unsc-sub">
            ORBITAL RESERVES CORPS (ORC)
            <br />
            TEYRA VERGE SYSTEM — OUTER COLONIES
            <br />
            COLONY WORLD: <Val k="planet" />
          </div>
        </div>
        <div className="doc-meta">
          <div className="meta-row">
            BRIEFING: <Val k="briefingNo" />
          </div>
          <div className="meta-row">
            DATE: <Val k="date" />
          </div>
          <div className="meta-row">
            CLEARANCE: <span>{clearanceLabel(data)}</span>
          </div>
          <div className="meta-row">
            STATUS: <span>CLASSIFIED</span>
          </div>
          <div className="meta-row">
            CAMPAIGN: <span><Val k="campaign" /></span>
          </div>
        </div>
      </div>
      <div>
        <div className="op-eyebrow">
          // <Val k="opEyebrow" /> //
        </div>
        <div className="op-name">
          <Val k="opName" />
        </div>
        <div className="op-subtitle">
          <Val k="opSubtitle" />
        </div>
        <div className="squadron-tag">
          <Val k="squadronTag" />
        </div>
      </div>
    </div>
  )
}
