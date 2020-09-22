import { Document } from './document';
export interface UpdateDocumentResponse {
  document: Document;
  companies: string[];
  categories: string[];
}
