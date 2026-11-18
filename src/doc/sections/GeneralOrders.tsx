import { MultiVal, Val } from '../context'
import { Field, Section } from '../primitives'

export function GeneralOrders() {
  return (
    <Section num="03" title="GENERAL ORDERS">
      <div className="stacked-fields">
        <Field label="TIMELINE"><Val k="timeline" /></Field>
        <Field label="TASKS"><MultiVal k="tasks" /></Field>
        <Field label="COORDINATION INSTRUCTION"><MultiVal k="coordinationInstruction" /></Field>
      </div>
    </Section>
  )
}
