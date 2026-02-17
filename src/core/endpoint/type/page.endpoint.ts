import { Endpoint } from "@/core/endpoint/endpoint";

export interface PageMetadata {
  page: number;
  limit: number;
  total: number;
}

export class PageEndpoint<TData> extends Endpoint<TData, PageMetadata> {
  constructor(data: TData, metadata: Partial<PageMetadata> = {}) {
    super(data, {
      page: 1,
      limit: 10,
      total: 0,
      ...metadata,
    });
  }
}
