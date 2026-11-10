import {
  CalendarClock, CalendarDays, ClipboardList, GraduationCap, History, LayoutList, Library, ListChecks,
  Atom, NotebookText, Package, PencilRuler, School, ScrollText, ShoppingBag, BookMarked, Bell, Timer, Trophy, BookOpen,
} from 'lucide-react'

export const academicColumns = [
  { title: 'Class 6–8', icon: School, desc: 'Strong foundations',
    links: [
      { label: 'Class 6', to: '/academic/class-6' },
      { label: 'Class 7', to: '/academic/class-7' },
      { label: 'Class 8', to: '/academic/class-8' },
    ] },
  { title: 'Class 9–10', icon: BookOpen, desc: 'Concepts & practice',
    links: [
      { label: 'Class 9', to: '/academic/class-9' },
      { label: 'Class 10', to: '/academic/class-10' },
    ] },
  { title: 'Class 11–12', icon: GraduationCap, desc: 'Stream-focused learning',
    links: [
      { label: 'Class 11', to: '/academic/class-11' },
      { label: 'Class 12', to: '/academic/class-12' },
    ] },
  { title: 'JEE & NEET', icon: Atom, desc: 'Engineering & medical entrance',
    links: [
      { label: 'JEE Main', to: '/exams/jee-main' },
      { label: 'JEE Advanced', to: '/exams/jee-advanced' },
      { label: 'NEET UG', to: '/exams/neet-ug' },
    ] },
  { title: 'Board Exam Preparation', icon: ClipboardList, desc: 'Score higher in boards',
    links: ['CBSE', 'ICSE', 'State Boards', 'Sample papers'] },
  { title: 'Subject-wise Learning', icon: Library, desc: 'Pick any subject',
    links: ['Maths', 'Physics', 'Chemistry', 'Biology'] },
]

export const testSeries = [
  { title: 'Full-Length Mock Tests', desc: 'Real exam interface & timing', icon: Timer },
  { title: 'Sectional Tests', desc: 'Section-by-section drills', icon: LayoutList },
  { title: 'Topic-wise Tests', desc: 'Fix weak areas fast', icon: ListChecks },
  { title: 'Previous Year Papers', desc: 'Solved, with analysis', icon: History },
]

export const examDetails = [
  { title: 'Latest Notifications', desc: 'New vacancies & forms', icon: Bell },
  { title: 'Exam Calendar', desc: 'Dates across all exams', icon: CalendarDays },
  { title: 'Syllabus', desc: 'Topic-wise breakdown', icon: ScrollText },
  { title: 'Exam Pattern', desc: 'Marks, sections, timing', icon: ClipboardList },
  { title: 'Important Dates', desc: 'Never miss a deadline', icon: CalendarClock },
  { title: 'Results', desc: 'Cut-offs & merit lists', icon: Trophy },
]

export const storeItems = [
  { title: 'Books', desc: 'Curated by exam & class', icon: BookMarked },
  { title: 'Study Material', desc: 'Notes, PDFs & formula sheets', icon: NotebookText },
  { title: 'Practice Resources', desc: 'Workbooks & question banks', icon: PencilRuler },
  { title: 'Exam Preparation Material', desc: 'Bundles for every exam', icon: Package },
]

export const navItems = [
  { id: 'academic', label: 'Academic', type: 'mega', badge: 'Class 6+' },
  { id: 'competitive', label: 'Competitive Exams', type: 'mega' },
  { id: 'tests', label: 'Test Series', type: 'dropdown', items: testSeries },
  { id: 'pyq', label: 'PYQs', ariaLabel: 'PYQs, Previous Year Questions', type: 'mega' },
  { id: 'details', label: 'Exam Details', type: 'dropdown', items: examDetails },
  { id: 'store', label: 'Campus Store', type: 'dropdown', icon: ShoppingBag, items: storeItems, wide: true,
    footer: 'Browse the Campus Store' },
]

export const searchSuggestions = ['Class 10 Maths', 'SSC CGL', 'SBI PO', 'BPSC TRE', 'CBSE sample papers']
