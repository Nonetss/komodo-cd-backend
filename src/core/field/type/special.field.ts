import {
  Field,
  FieldData,
  FieldOptions,
  FieldType,
  UIComponent,
} from "@/core/field/field";

export enum SpecialFieldType {
  WORKER = "worker",
  GROUPS = "groups",
}

export interface SpecialFieldData extends FieldData {
  subtype: SpecialFieldType;
}

export class SpecialField extends Field<SpecialFieldData> {
  readonly type = FieldType.SPECIAL;

  constructor(
    readonly id: string,
    name: string,
    description: string,
    required: boolean = false,
    uiComponent: UIComponent,
    options: FieldOptions,
    private subtype: SpecialFieldType,
  ) {
    super(name, description, required, uiComponent, options);
  }

  public override getData(): SpecialFieldData {
    return {
      ...super.getData(),
      subtype: this.subtype,
    };
  }
}
