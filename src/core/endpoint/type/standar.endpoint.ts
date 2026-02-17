import { Endpoint } from "@/core/endpoint/endpoint";

export class StandardEndpoint extends Endpoint {
  constructor(data: Record<string, unknown>) {
    super(data);
  }
}
