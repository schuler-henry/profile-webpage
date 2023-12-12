export abstract class DatabaseAdapter {
  abstract getSummaryNames(): Promise<string[]>;
  abstract getSummary(summaryName: string): Promise<Blob | null>;
  abstract getSummaryPDFUrl(filePath: string): Promise<string>;
}
