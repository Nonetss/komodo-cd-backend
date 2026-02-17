import { Endpoint } from "@/core/endpoint/endpoint";

export class EmptyEndpoint extends Endpoint<null> {
  constructor() {
    super(null);
  }

  protected override exists(): boolean {
    return false;
  }
}
