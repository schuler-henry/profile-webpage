interface StudiesSummary {
  id?: number;
  title?: string;
  description?: string;
  degree?: number | StudiesDegree;
  language?: string | StudiesLanguage;
  university?: string | StudiesUniversity;
  semester?: number;
  semesterPeriod?: string | StudiesSemester;
  lastModified?: string;
  file?: string;
  professors?: StudiesProfessor[];
}

interface StudiesSemester {
  name?: string;
}

interface StudiesDegree {
  degree?: string;
  subject?: string;
  id?: number;
}

interface StudiesLanguage {
  code?: string;
}

interface StudiesProfessor {
  id?: number;
  firstName?: string;
  lastName?: string;
}

interface StudiesUniversity {
  name?: string;
}
