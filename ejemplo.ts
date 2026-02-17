import { Field, FieldType, UIComponent } from "@/core/field/field";
import {
  SpecialField,
  SpecialFieldType,
  SpecialFieldTypeData,
} from "@/core/field/type/special.field";

// --- Crear un campo especial (p. ej. asignar trabajador)
const campoTrabajador = new SpecialField(
  "campo-trabajador-1",
  "Trabajador asignado",
  "Selecciona el trabajador que realiza la tarea",
  true, // required
  UIComponent.SPECIAL,
  { isArray: false, isRequired: true },
  SpecialFieldType.WORKER,
);

// --- Obtener datos del campo (para enviar al front / API)
const datos = campoTrabajador.getData();
console.log(datos);
// {
//   id: "campo-trabajador-1",
//   name: "Trabajador asignado",
//   description: "...",
//   type: "special",
//   required: true,
//   uiComponent: "special",
//   options: { isArray: false, isRequired: true },
//   typeData: { subtype: "worker" }
// }

// --- Usar varios campos de forma polimórfica (Field es la base)
const campos: Field[] = [
  campoTrabajador,
  new SpecialField(
    "campo-grupos-1",
    "Grupos",
    "Grupos de trabajo",
    false,
    UIComponent.SPECIAL,
    { isArray: true, isRequired: false },
    SpecialFieldType.GROUPS,
  ),
];

// --- Recorrer y usar typeData cuando el tipo es SPECIAL
for (const campo of campos) {
  const data = campo.getData();
  if (data.type === FieldType.SPECIAL && data.typeData) {
    const typeData = data.typeData as SpecialFieldTypeData;
    console.log(`Campo especial con subtype: ${typeData.subtype}`);
  }
}
