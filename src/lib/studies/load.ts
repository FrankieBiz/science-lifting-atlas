import type { StudyFile } from './studies';

const files = import.meta.glob<StudyFile>('../../data/studies/*.json', {
  eager: true,
  import: 'default',
});

export function loadStudies(slug: string): StudyFile {
  const file = files[`../../data/studies/${slug}.json`];
  if (!file) {
    throw new Error(
      `No studies for "${slug}". Run \`pnpm studies:fetch ${slug}\`.`,
    );
  }
  return file;
}

export function studyCount(slug: string): number {
  return Object.values(loadStudies(slug).categories).reduce(
    (total, studies) => total + studies.length,
    0,
  );
}
