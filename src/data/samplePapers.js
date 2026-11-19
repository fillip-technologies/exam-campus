/**
 * DEV-ONLY preview data for previous year papers (exam hub section and /exams/:slug/previous-year-papers).
 *
 * The API sends no papers for the exam yet, so `npm run dev` shows these in their place. Production builds never
 * include them (every import is behind `import.meta.env.DEV`). Delete this file once real papers are added.
 *
 * PLACEHOLDER: years, shifts and links are illustrative, not real paper records. Question / mark / time counts
 * follow the SBI PO pattern on the hub (Prelims 100 Q · 100 marks · 60 min; Mains objective 155 Q · 200 marks · 3 h).
 */
const prelims = { stage: 'Prelims', questions: 100, marks: 100, durationMinutes: 60 }
const mains = { stage: 'Mains', questions: 155, marks: 200, durationMinutes: 180 }

const year = (y, prelimsShifts, withMains, practice) => [
  ...Array.from({ length: prelimsShifts }, (_, i) => ({
    ...prelims,
    year: y,
    shift: `Shift ${i + 1}`,
    type: 'Memory Based',
    languages: ['English', 'Hindi'],
    viewUrl: '#',
    downloadUrl: '#',
    practiceUrl: practice ? '#' : undefined,
  })),
  ...(withMains ? [{ ...mains, year: y, type: 'Memory Based', languages: ['English', 'Hindi'], viewUrl: '#', downloadUrl: '#', practiceUrl: practice ? '#' : undefined }] : []),
]

// A function (not a computed constant) so production builds can drop this module entirely.
export const samplePapers = () => [...year(2025, 4, true, true), ...year(2023, 3, true, true), ...year(2022, 2, true, false), ...year(2021, 2, true, false), ...year(2019, 2, false, false)]
