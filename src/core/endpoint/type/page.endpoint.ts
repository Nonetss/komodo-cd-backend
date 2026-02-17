import { Endpoint } from "@/core/endpoint/endpoint";

export interface PageMetadata {
  page: number;
  limit: number;
  total: number;
  [key: string]: unknown;
}

export class PageEndpoint extends Endpoint {
  constructor(
    data: Record<string, unknown>,
    metadata: Partial<PageMetadata> = {},
  ) {
    super(data, {
      page: 1,
      limit: 10,
      total: 0,
      ...metadata,
    });
  }

  protected exists(): boolean {
    return (
      this.data !== undefined &&
      this.data !== null &&
      Object.keys(this.data).length > 0
    );
  }

  public override getData() {
    return {
      ...super.getData(),
      metadata: {
        ...this.metadata,
        exists: this.exists(),
        page: this.metadata.page,
        limit: this.metadata.limit,
        total: this.metadata.total,
      },
    };
  }
}
