import { defineRelations } from "drizzle-orm";
import * as schema from "@/db";

export const relations = defineRelations(schema, (r) => ({}));
