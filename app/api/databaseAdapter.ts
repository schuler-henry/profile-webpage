export abstract class DatabaseAdapter {
  abstract getSummary(summaryName: string): Promise<Blob | null>;
  abstract getSummaryPDFUrl(filePath: string): Promise<string>;
}
