export interface EndpointData<TData, TMeta = {}> {
  data: TData;
  metadata: { exists: boolean } & TMeta;
}

export abstract class Endpoint<TData, TMeta = {}> {
  constructor(
    protected data: TData,
    protected metadata: TMeta = {} as TMeta,
  ) {}

  protected exists(): boolean {
    return (
      this.data !== undefined &&
      this.data !== null &&
      typeof this.data === "object" &&
      Object.keys(this.data as object).length > 0
    );
  }

  public getData(): EndpointData<TData, TMeta> {
    return {
      data: this.data,
      metadata: {
        exists: this.exists(),
        ...this.metadata,
      },
    };
  }
}
