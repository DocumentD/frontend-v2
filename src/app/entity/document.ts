export interface Document {
  documentid: string;
  title: string;
  documentdate: string;
  deletedate?: string;
  pages: number;
  textcontent?: string;
  pdftitle?: string;
  company?: string;
  category?: string;
  tags: string[];
  filename: string;
  _matchesInfo: any[];
}
