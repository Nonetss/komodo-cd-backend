import {
  Field,
  FieldOptions,
  FieldType,
  UIComponent,
} from "@/core/field/field";

export enum SpecialFieldType {
  WORKER = "worker",
  GROUPS = "groups",
}

/** typeData cuando el campo es tipo SPECIAL */
export interface SpecialFieldTypeData {
  subtype: SpecialFieldType;
}

export class SpecialField extends Field {
  readonly type = FieldType.SPECIAL;

  constructor(
    readonly id: string,
    name: string,
    description: string,
    required: boolean = false,
    uiComponent: UIComponent,
    options: FieldOptions,
    protected readonly subtype: SpecialFieldType,
  ) {
    super(name, description, required, uiComponent, options, {
      subtype: subtype,
    });
  }

  public override getData() {
    return super.getData();
  }
}
