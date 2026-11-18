import { MultiVal } from "../context";
import { Field, Grid, Intel, Section } from "../primitives";

export function Sustainment() {
  return (
    <Section num="06" title="SUSTAINMENT">
      <Grid cols={2}>
        <Field label="NAVAL ASSETS">
          <MultiVal k="navalAssets" />
        </Field>
        <Field label="SPECIAL CAPABILITIES">
          <MultiVal k="specialCapabilities" />
        </Field>
        <Field label="GROUND ASSETS">
          <MultiVal k="groundAssets" />
        </Field>
        <Field label="AIR ASSETS">
          <MultiVal k="airAssets" />
        </Field>
      </Grid>
      <Intel label="// GUIDANCE (CRITICAL) //" tone="red">
        <p>
          The above allocations are <strong>FINAL</strong>. Losses cannot be
          replaced. Expenditure of all munitions and vehicles must be logged and
          authorized by fleet command. Conservation of assets is mandatory for
          endurance for the full campaign duration.
        </p>
      </Intel>
    </Section>
  );
}
