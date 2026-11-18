import { MultiVal } from '../context'
import { Field, Section } from '../primitives'

export function CommandAndSignal() {
  return (
    <Section num="07" title="COMMAND AND SIGNAL">
      <div className="stacked-fields">
        <Field label="CHAIN OF COMMAND"><MultiVal k="chainOfCommand" /></Field>
        <Field label="COMMS NETS"><MultiVal k="commsNets" /></Field>
        <Field label="SMOKE & SIGNALS"><MultiVal k="smokeAndSignals" /></Field>
        <Field label="CODEWORDS"><MultiVal k="codewords" /></Field>
        <Field label="SUNDIAL PROCEDURE"><MultiVal k="sundialProcedure" /></Field>
      </div>
    </Section>
  )
}
