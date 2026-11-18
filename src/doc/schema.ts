// Single source of truth for variable content. The form is generated from
// this, and <Val k="..."> in document sections looks up labels here.
// Static content never appears here; it lives directly in section components.

export interface Option {
  value: string;
  label: string;
}

interface BaseField {
  key: string;
  label: string;
}

export interface TextField extends BaseField {
  kind: "text" | "textarea";
  default?: string;
}

export interface SelectField extends BaseField {
  kind: "select";
  options: readonly Option[];
  default?: string;
}

export interface ListField extends BaseField {
  kind: "list";
  addLabel: string;
  itemFields: readonly (TextField | SelectField)[];
}

export type Field = TextField | SelectField | ListField;

export interface SectionDef {
  id: string;
  title: string;
  fields: readonly Field[];
}

export const sections = [
  {
    id: "header",
    title: "Banner & Header",
    fields: [
      {
        key: "clearance",
        label: "Clearance level",
        kind: "select",
        options: [
          { value: "II", label: "Level II" },
          { value: "III", label: "Level III" },
        ],
        default: "III",
      },
      { key: "planet", label: "Colony world", kind: "text" },
      { key: "briefingNo", label: "Briefing number", kind: "text" },
      { key: "date", label: "Date", kind: "text" },
      { key: "campaign", label: "Campaign mission", kind: "text" },
      { key: "opEyebrow", label: "Operational order line", kind: "text" },
      { key: "opName", label: "Operation name", kind: "text" },
      { key: "opSubtitle", label: "Operation subtitle", kind: "text" },
      { key: "squadronTag", label: "Squadron tag", kind: "text" },
    ],
  },
  {
    id: "situation",
    title: "01 Situation",
    fields: [
      { key: "areaOfOperation", label: "Area of Operation", kind: "text" },
      { key: "enemyPresence", label: "Enemy Presence", kind: "textarea" },
      { key: "friendlyPersonnel", label: "Friendly Personnel", kind: "textarea" },
      { key: "civilianStatus", label: "Civilian status", kind: "textarea" },
    ],
  },
  {
    id: "mission",
    title: "02 Mission",
    fields: [
      { key: "missionStatement", label: "Mission statement", kind: "textarea" },
      {
        key: "objectives",
        label: "Objectives",
        kind: "list",
        addLabel: "Add objective",
        itemFields: [
          {
            key: "tier",
            label: "Priority",
            kind: "select",
            options: [
              { value: "pri", label: "Primary" },
              { value: "sec", label: "Secondary" },
              { value: "ter", label: "Tertiary" },
            ],
            default: "pri",
          },
          { key: "title", label: "Title", kind: "text" },
          { key: "body", label: "Details", kind: "textarea" },
        ],
      },
      {
        key: "primaryObjective",
        label: "Primary objective summary",
        kind: "text",
      },
      {
        key: "expectedThreats",
        label: "Other expected threats",
        kind: "textarea",
      },
    ],
  },
  {
    id: "generalOrders",
    title: "03 General Orders",
    fields: [
      { key: "timeline", label: "Timeline", kind: "text" },
      { key: "tasks", label: "Tasks", kind: "textarea" },
      { key: "coordinationInstruction", label: "Coordination Instruction", kind: "textarea" },
    ],
  },
  {
    id: "sustainment",
    title: "06 Sustainment",
    fields: [
      { key: "navalAssets", label: "Naval assets", kind: "textarea" },
      {
        key: "specialCapabilities",
        label: "Special capabilities",
        kind: "textarea",
      },
      {
        key: "groundAssets",
        label: "Ground assets (one per line)",
        kind: "textarea",
      },
      {
        key: "airAssets",
        label: "Air assets (one per line)",
        kind: "textarea",
      },
    ],
  },
] as const satisfies readonly SectionDef[];

type AllFields = (typeof sections)[number]["fields"][number];
export type ValueKey = Extract<
  AllFields,
  { kind: "text" | "textarea" | "select" }
>["key"];
export type ListKey = Extract<AllFields, { kind: "list" }>["key"];

export interface Row {
  id: string;
  [field: string]: string;
}

export interface OpordData {
  values: Partial<Record<ValueKey, string>>;
  lists: Partial<Record<ListKey, Row[]>>;
}

const allFields: readonly Field[] = sections.reduce<Field[]>(
  (acc, s) => [...acc, ...s.fields],
  [],
);

export function findField(key: string): Field | undefined {
  return allFields.find((f) => f.key === key);
}

export function makeDefaults(): OpordData {
  const values: Record<string, string> = {};
  for (const f of allFields) {
    if (f.kind !== "list" && f.default) values[f.key] = f.default;
  }
  return { values, lists: {} };
}

export function newRow(field: ListField): Row {
  const row: Row = { id: crypto.randomUUID() };
  for (const f of field.itemFields) row[f.key] = f.default ?? "";
  return row;
}

export function clearanceLabel(data: OpordData): string {
  return `LEVEL ${data.values.clearance ?? "III"}`;
}
