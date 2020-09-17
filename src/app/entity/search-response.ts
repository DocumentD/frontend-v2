export interface SearchResponse {
  hits: Document[];
  offset: number;
  limit: number;
  nbHits: number;
  exhaustiveNbHits: boolean;
  processingTimeMs: number;
  query: string;
}
