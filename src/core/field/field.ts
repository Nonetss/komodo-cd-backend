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
  /** Información extra que puedes añadir en las clases que extiendan Field */
  extra?: Record<string, unknown>;
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
    ...extra: Record<string, unknown>[]
  ) {
    this.extra = extra.length > 0 ? Object.assign({}, ...extra) : {};
  }

  /** Información extra; las subclases pueden leerla, añadirla o modificarla */
  protected extra: Record<string, unknown>;

  public getData(): FieldData {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      required: this.required,
      uiComponent: this.uiComponent,
      options: this.options,
      ...(Object.keys(this.extra).length > 0 && { extra: this.extra }),
    };
  }
}
