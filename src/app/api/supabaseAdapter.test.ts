import { SummaryMatter } from '../studies/summaries/[summaryName]/page';
import { SupabaseAdapter } from './supabaseAdapter';
import { StudiesSummary } from './supabaseTypes';

describe('supabaseAdapter', () => {
  it('should be created', () => {
    // Arrange
    const supabaseAdapter = new SupabaseAdapter();
    // Act
    // Assert

    expect(supabaseAdapter).toBeTruthy();
  });

  it('should get summary matter', async () => {
    // Arrange
    const supabaseAdapter = new SupabaseAdapter();
    // Act
    const names = await supabaseAdapter.selectStudiesSummary();
    // Assert
    expect(names).toEqual({
      error: null,
      status: 200,
      statusText: 'OK',
      count: null,
      data: [
        {
          title: 'Softwarequalitaetssicherung',
          description: 'Zusammenfassung für die mündliche Prüfung',
          file: 'softwarequalitaetssicherung.mdx',
          lastModified: '2024-03-04',
          degree: { degree: 'M. Sc.', id: 1, subject: 'Software Engineering' },
          id: 3,
          language: { code: 'DE' },
          professors: [
            { id: 2, firstName: 'M.', lastName: 'Tichy' },
            { id: 3, firstName: 'A.', lastName: 'Raschke' },
          ],
          semester: 1,
          semesterPeriod: { name: 'WiSe 2023/24' },
          university: { name: 'Uni Ulm' },
        } as StudiesSummary,
      ],
    });
  });

  it('should cast summary infos', async () => {
    // Arrange
    const supabaseAdapter = new SupabaseAdapter();
    // Act
    const names = supabaseAdapter.getStudiesSummaryMatterFromResponse(
      await supabaseAdapter.selectStudiesSummary(),
    );
    // Assert
    expect(names).toEqual([
      {
        title: 'Softwarequalitaetssicherung',
        description: 'Zusammenfassung für die mündliche Prüfung',
        fileName: 'softwarequalitaetssicherung.mdx',
        lastModified: new Date('2024-03-04'),
        degree: 'M. Sc.',
        degreeSubject: 'Software Engineering',
        id: 3,
        language: 'DE',
        professors: [
          { id: 2, firstName: 'M.', lastName: 'Tichy' },
          { id: 3, firstName: 'A.', lastName: 'Raschke' },
        ],
        semester: 1,
        semesterPeriod: 'WiSe 2023/24',
        university: 'Uni Ulm',
      } as SummaryMatter,
    ]);
  });
});
