import { SummaryMatter } from '@/app/studies/summaries/[summaryName]/page';
import { IDBPDatabase, openDB } from 'idb';

export class IndexedDBAdapter {
  private StudiesIDB: IDBPDatabase | undefined = undefined;

  private constructor() {}

  static async createIndexedDBAdapter(): Promise<IndexedDBAdapter> {
    const adapter = new IndexedDBAdapter();
    await adapter.openSummaryDatabase();
    return adapter;
  }

  async openSummaryDatabase(): Promise<void> {
    if (this.StudiesIDB !== undefined) return;

    this.StudiesIDB = await openDB('Studies', 1, {
      upgrade(database, oldVersion, newVersion, transaction, event) {
        if (!database.objectStoreNames.contains('summaryMatters')) {
          const summaryMattersStore = database.createObjectStore(
            'summaryMatters',
            { keyPath: 'id' },
          );
          summaryMattersStore.createIndex('fileName', 'fileName', {
            unique: true,
          });
        }
        if (!database.objectStoreNames.contains('summaries')) {
          const summariesStore = database.createObjectStore('summaries', {
            keyPath: 'id',
          });
          summariesStore.createIndex('fileName', 'fileName', { unique: true });
        }
      },
      terminated() {
        console.log('IDB terminated.');
      },
    });
  }

  async addSummaryMatter(matter: SummaryMatter): Promise<void> {
    if (this.StudiesIDB === undefined) return;

    const transaction = this.StudiesIDB.transaction(
      ['summaryMatters'],
      'readwrite',
    );
    const summaryMattersStore = transaction.objectStore('summaryMatters');
    await summaryMattersStore.put(matter);
    await transaction.done;
  }

  async removeSummaryMatter(matter: SummaryMatter) {
    if (this.StudiesIDB === undefined || matter.id === undefined) return;
    console.log(matter.id);

    const transaction = this.StudiesIDB.transaction(
      ['summaryMatters'],
      'readwrite',
    );
    const summaryMattersStore = transaction.objectStore('summaryMatters');
    await summaryMattersStore.delete(matter.id);
    await transaction.done;
  }

  async getSummaryMatters(): Promise<SummaryMatter[]> {
    if (this.StudiesIDB === undefined) return [];

    const transaction = this.StudiesIDB.transaction(['summaryMatters']);
    const summaryMattersStore = transaction.objectStore('summaryMatters');
    const summaryMatters = await summaryMattersStore.getAll();
    await transaction.done;

    return summaryMatters;
  }

  addSummary() {}

  getSummary() {}

  removeSummary() {}
}
