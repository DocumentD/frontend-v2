export interface Document {
  documentid: string;
  title: string;
  documentdate: Date;
  deletedate?: Date;
  pages: number;
  textcontent?: string;
  pdftitle?: string;
  company?: string;
  category?: string;
  tags: string[];
  filename: string;
  _matchesInfo: any[];
}
