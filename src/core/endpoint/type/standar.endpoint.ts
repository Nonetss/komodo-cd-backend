import { Endpoint } from "@/core/endpoint/endpoint";

export class StandardEndpoint<TData> extends Endpoint<TData> {
  constructor(data: TData) {
    super(data);
  }
}
