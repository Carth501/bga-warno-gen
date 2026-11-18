import { MultiVal, Val, useList } from '../context'
import { Objective, Section } from '../primitives'

export function Mission() {
  const objectives = useList('objectives')
  return (
    <Section num="02" title="MISSION" tone="gold">
      <p>
        <MultiVal k="missionStatement" />
      </p>
      <ul className="obj-list">
        {objectives.map((o, i) => (
          <Objective key={o.id} tier={o.tier} n={i + 1}>
            <strong>{o.title?.toUpperCase() || '[TITLE]'}</strong>{' '}
            {o.body ? <span className="ml">{o.body}</span> : <span className="blank">[DETAILS]</span>}
          </Objective>
        ))}
      </ul>
      <p style={{ marginTop: 12 }}>
        <strong>Primary Objective:</strong> <Val k="primaryObjective" />
      </p>
      <p>
        <MultiVal k="expectedThreats" />
      </p>
    </Section>
  )
}
