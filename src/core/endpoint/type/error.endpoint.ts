import { Endpoint } from "@/core/endpoint/endpoint";

export interface ErrorMetadata {
  status: number;
  code: string;
  message: string;
}

export class ErrorEndpoint extends Endpoint<null, ErrorMetadata> {
  constructor(status: number, code: string, message: string) {
    super(null, { status, code, message });
  }

  protected override exists(): boolean {
    return false;
  }
}
