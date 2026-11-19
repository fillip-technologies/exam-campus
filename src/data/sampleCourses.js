/**
 * DEV-ONLY preview data for the Courses and Faculty sections on exam hub pages.
 *
 * The API does not send `courses` / `faculty` on GET /public/exams/:slug yet, so `npm run dev` shows these
 * samples in their place. Production builds never include them (the import is behind `import.meta.env.DEV`).
 * Delete this file and its import in ExamDetailsPage once the backend serves real courses.
 *
 * PLACEHOLDER: the video link below is a public sample video. Paste a real ExamCampus demo class link.
 */
const SAMPLE_VIDEO = 'https://www.youtube.com/watch?v=jNQXAC9IVRw'

// last day of the current month, so the sample coupon never shows as expired
const now = new Date()
const MONTH_END = new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString('en-CA')

/** PLACEHOLDER teachers for the Faculty section preview (no real people). */
export const sampleFaculty = [
  { id: 'f-quant', name: 'Quant Faculty', subject: 'Quantitative Aptitude', experience: 'Sample profile', demoVideoUrl: SAMPLE_VIDEO },
  { id: 'f-reasoning', name: 'Reasoning Faculty', subject: 'Reasoning Ability', experience: 'Sample profile', demoVideoUrl: SAMPLE_VIDEO },
  { id: 'f-english', name: 'English Faculty', subject: 'English Language', experience: 'Sample profile', demoVideoUrl: SAMPLE_VIDEO },
  { id: 'f-ga', name: 'Banking Faculty', subject: 'Banking Awareness', experience: 'Sample profile', demoVideoUrl: SAMPLE_VIDEO },
]

export const sampleCourses = (examName) => [
  {
    id: 'sample-foundation',
    title: `${examName} Foundation Batch (Prelims + Mains)`,
    subtitle: 'Prelims + Mains',
    mode: 'LIVE',
    languages: ['Hinglish'],
    faculty: ['ExamCampus Faculty'],
    startDate: '2026-12-15',
    liveClasses: 250,
    recordedVideos: 400,
    totalTests: 120,
    includes: ['Live classes with doubt solving', 'Recordings of every class', 'PDF notes', 'Mock tests with analysis'],
    media: [
      { type: 'image', url: '/images/students/banker.jpg', alt: '' },
      { type: 'youtube', url: SAMPLE_VIDEO, title: 'Demo class' },
    ],
    demoVideoUrl: SAMPLE_VIDEO,
    price: 2999,
    originalPrice: 6999,
    validity: '12 Months',
    offer: 'Bestseller',
    coupon: { code: 'SBIPO10', discountPercent: 10, validTill: MONTH_END },
    enrollUrl: '#courses',
  },
  {
    id: 'sample-mains',
    title: `${examName} Mains Crash Course`,
    subtitle: 'Mains only',
    mode: 'RECORDED',
    languages: ['English', 'Hindi'],
    recordedVideos: 180,
    totalTests: 30,
    includes: ['Recorded video lessons', 'Descriptive writing practice', 'Mains mock tests'],
    media: [{ type: 'youtube', url: SAMPLE_VIDEO, title: 'Course introduction' }],
    demoVideoUrl: SAMPLE_VIDEO,
    price: 1499,
    originalPrice: 2999,
    validity: '6 Months',
    enrollUrl: '#courses',
  },
  {
    id: 'sample-interview',
    title: `${examName} Interview Guidance`,
    subtitle: 'Interview',
    mode: 'HYBRID',
    languages: ['English'],
    liveClasses: 20,
    includes: ['Live sessions', 'Mock interview', 'Group exercise practice'],
    price: 999,
    originalPrice: 1999,
    validity: '3 Months',
    enrollUrl: '#courses',
  },
]
