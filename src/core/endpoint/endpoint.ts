export interface EndpointData {
  data: Record<string, unknown>;
  metadata: Record<string, unknown>;
}

export abstract class Endpoint {
  constructor(
    protected data: Record<string, unknown>,
    protected metadata: Record<string, unknown> = {},
  ) {
    this.data = data;
    this.metadata = metadata;
  }

  protected exists(): boolean {
    return (
      this.data !== undefined &&
      this.data !== null &&
      Object.keys(this.data).length > 0
    );
  }

  public getData(): EndpointData {
    return {
      data: this.data,
      metadata: {
        exists: this.exists(),
        ...this.metadata,
      },
    };
  }
}
