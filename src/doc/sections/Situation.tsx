import { MultiVal, Val } from '../context'
import { Field, Section } from '../primitives'

export function Situation() {
  return (
    <Section num="01" title="SITUATION">
      <div className="situation-fields">
        <Field label="AREA OF OPERATION"><Val k="areaOfOperation" /></Field>
        <Field label="ENEMY PRESENCE"><MultiVal k="enemyPresence" /></Field>
        <Field label="FRIENDLY PERSONNEL"><MultiVal k="friendlyPersonnel" /></Field>
        <Field label="CIVILIAN STATUS"><MultiVal k="civilianStatus" /></Field>
      </div>
    </Section>
  )
}
