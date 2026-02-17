export interface FieldOptions {
  isArray: boolean;
  isRequired: boolean;
}

export enum UIComponent {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATE = "date",
  TIME = "time",
  SPECIAL = "special",
}

export interface FieldData {
  id: string;
  name: string;
  description: string;
  type: FieldType;
  required: boolean;
  uiComponent: UIComponent;
  options: FieldOptions;
  /** Información adicional según el tipo de campo (p. ej. subtype en SPECIAL) */
  typeData?: unknown;
}

export enum FieldType {
  TEXT = "text",
  TEXTAREA = "textarea",
  NUMBER = "number",
  BOOLEAN = "boolean",
  DATE = "date",
  TIME = "time",
  SPECIAL = "special",
}

export abstract class Field {
  abstract readonly id: string;
  abstract readonly type: FieldType;

  constructor(
    protected name: string,
    protected description: string,
    protected required: boolean = false,
    protected uiComponent: UIComponent,
    protected options: FieldOptions,
  ) {}

  public getData(): FieldData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      required: this.required,
      uiComponent: this.uiComponent,
      options: this.options,
    };
  }
}
