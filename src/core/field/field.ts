export interface FieldOptions {
  isArray: boolean;
  isRequired: boolean;
}

export enum UIComponent {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  TIME = "TIME",
  SPECIAL = "SPECIAL",
}

export interface FieldData {
  id: string;
  name: string;
  description: string;
  type: FieldType;
  required: boolean;
  uiComponent: UIComponent;
  options: FieldOptions;
}

export enum FieldType {
  TEXT = "TEXT",
  TEXTAREA = "TEXTAREA",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  DATE = "DATE",
  TIME = "TIME",
  SPECIAL = "SPECIAL",
}

export abstract class Field<T extends FieldData = FieldData> {
  abstract readonly id: string;
  abstract readonly type: FieldType;

  constructor(
    protected name: string,
    protected description: string,
    protected required: boolean = false,
    protected uiComponent: UIComponent,
    protected options: FieldOptions,
  ) {}

  public getData(): T {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type,
      required: this.required,
      uiComponent: this.uiComponent,
      options: this.options,
    } as T;
  }
}
