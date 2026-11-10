/**
 * SBI PO: master data for the Exam Hub page (/exams/sbi-po).
 *
 * Every section of the page reads from this object. To add another exam, copy this file,
 * change the values and register it in ./index.js.
 *
 * Rules for this data:
 *  - `null` means "not announced / not available": the UI shows "To Be Announced" or hides the item.
 *  - Never put guessed dates here. Add a date (ISO format, YYYY-MM-DD) only after it is officially announced.
 *  - Sections marked PLACEHOLDER hold sample values for ExamCampus's own products
 *    (prices, test counts). Replace them with real values before launch.
 *  - Exam pattern, eligibility and syllabus follow recent SBI notifications; re-check them against
 *    the latest official notification each recruitment cycle.
 */
const sbiPo = {
  slug: 'sbi-po',
  name: 'SBI PO',
  fullName: 'State Bank of India Probationary Officer Examination',
  category: 'Banking & Insurance',
  categorySlug: 'banking',
  org: 'sbi',
  description:
    'SBI PO is the recruitment examination conducted by the State Bank of India to select Probationary Officers. The selection process has three phases: a Preliminary Examination, a Main Examination, and a Psychometric Test with Group Exercise and Interview.',

  // Optional. Example: { label: 'Notification released', tone: 'info' }
  status: null,

  quickInfo: [
    { label: 'Conducting Body', value: 'State Bank of India (SBI)' },
    { label: 'Exam Level', value: 'National' },
    { label: 'Exam Mode', value: 'Online (Computer Based Test)' },
    { label: 'Exam Date', value: null },
    { label: 'Application Status', value: null },
    { label: 'Vacancy', value: null },
  ],

  // PLACEHOLDER: replace prices and counts with real product data. The first series is the one the Enroll page and quick CTAs use by default.
  testSeries: [
    {
      id: 'sbi-po-complete',
      image: '/images/posters/sbi-po.jpg',
      title: 'SBI PO Complete Test Series',
      subtitle: 'Prelims + Mains',
      totalTests: 330,
      fullLengthTests: 30,
      sectionalTests: 100,
      practiceTests: 200,
      languages: ['Hindi', 'English'],
      validity: '12 Months',
      price: 799,
      originalPrice: 2499,
      includes: [
        'Prelims and Mains mock tests',
        'Sectional and topic-wise practice',
        'Detailed solutions',
        'Performance analysis',
      ],
      enrollUrl: '/enroll/sbi-po-complete',
      detailsUrl: '#test-series',
    },
    {
      id: 'sbi-po-prelims',
      title: 'SBI PO Prelims Test Series',
      subtitle: 'Prelims only',
      totalTests: 100,
      fullLengthTests: 20,
      sectionalTests: 40,
      practiceTests: 40,
      languages: ['Hindi', 'English'],
      validity: '12 Months',
      price: 499,
      originalPrice: 1499,
      includes: [
        'Prelims-pattern mock tests',
        'Timed online tests',
        'Detailed solutions',
        'Performance analysis',
      ],
      enrollUrl: '/enroll/sbi-po-prelims',
      detailsUrl: '#test-series',
    },
    {
      id: 'sbi-po-mains',
      title: 'SBI PO Mains Test Series',
      subtitle: 'Mains only',
      totalTests: 120,
      fullLengthTests: 15,
      sectionalTests: 45,
      practiceTests: 60,
      languages: ['Hindi', 'English'],
      validity: '12 Months',
      price: 599,
      originalPrice: 1799,
      includes: [
        'Mains-pattern mock tests',
        'Data Analysis and Reasoning sets',
        'Detailed solutions',
        'Performance analysis',
      ],
      enrollUrl: '/enroll/sbi-po-mains',
      detailsUrl: '#test-series',
    },
    {
      id: 'sbi-po-sectional',
      title: 'SBI PO Sectional Test Series',
      subtitle: 'Section-wise tests',
      totalTests: 150,
      fullLengthTests: 0,
      sectionalTests: 150,
      practiceTests: 0,
      languages: ['Hindi', 'English'],
      validity: '12 Months',
      price: 399,
      originalPrice: 1199,
      includes: [
        'Reasoning, Quant, English and Data Analysis tests',
        'Timed sectional tests',
        'Detailed solutions',
        'Section-wise analysis',
      ],
      enrollUrl: '/enroll/sbi-po-sectional',
      detailsUrl: '#test-series',
    },
    {
      id: 'sbi-po-topic-wise',
      title: 'SBI PO Topic-wise Practice Series',
      subtitle: 'Topic-wise tests',
      totalTests: 200,
      fullLengthTests: 0,
      sectionalTests: 0,
      practiceTests: 200,
      languages: ['Hindi', 'English'],
      validity: '12 Months',
      price: 399,
      originalPrice: 1199,
      includes: [
        'Topic-wise tests for every section',
        'Chapter-wise practice sets',
        'Detailed solutions',
        'Weak-topic analysis',
      ],
      enrollUrl: '/enroll/sbi-po-topic-wise',
      detailsUrl: '#test-series',
    },
    {
      id: 'sbi-po-previous-year-papers',
      title: 'SBI PO Previous Year Papers Series',
      subtitle: 'Previous year papers',
      totalTests: 20,
      fullLengthTests: 20,
      sectionalTests: 0,
      practiceTests: 0,
      languages: ['Hindi', 'English'],
      validity: '12 Months',
      price: 299,
      originalPrice: 999,
      includes: [
        'Previous year papers as online tests',
        'Real exam interface',
        'Detailed solutions',
        'Performance analysis',
      ],
      enrollUrl: '/enroll/sbi-po-previous-year-papers',
      detailsUrl: '#test-series',
    },
  ],

  // Newest first when rendered. Add items only from official notifications.
  // { date: '2026-01-31', title: '', description: '', sourceUrl: '', sourceLabel: '' }
  latestUpdates: [],

  // `date` is an ISO date or null (shown as "To Be Announced"). `highlight: true` also shows the event as a tile above the table.
  importantDates: [
    { event: 'Notification Date', date: null },
    { event: 'Application Start Date', date: null },
    { event: 'Application Last Date', date: null, highlight: true },
    { event: 'Admit Card Date', date: null },
    { event: 'Prelims Exam Date', date: null, highlight: true },
    { event: 'Mains Exam Date', date: null },
    { event: 'Interview', date: null },
    { event: 'Final Result', date: null, highlight: true },
  ],

  eligibility: {
    // The most important facts, shown as highlighted tiles above the details. Keep them in sync with the text below.
    highlights: [
      { label: "Qualification", value: "Graduation in any discipline" },
      { label: "Age limit", value: "21 to 30 years" },
      { label: "Age relaxation", value: "SC / ST 5 yrs · OBC 3 yrs · PwBD 10 yrs" },
      { label: "Nationality", value: "Citizen of India" },
    ],
    sections: [
      {
        title: 'Educational Qualification',
        blocks: [
          { type: 'paragraph', text: 'Candidates must hold a Bachelor’s degree in any discipline from a recognised university or an equivalent qualification recognised by the Government of India.' },
          { type: 'note', text: 'Final-year or final-semester students can usually apply provisionally, provided they produce proof of graduation by the date mentioned in the notification.' },
        ],
      },
      {
        title: 'Age Limit',
        blocks: [
          { type: 'paragraph', text: 'The age limit is generally 21 to 30 years as on the date specified in the notification (usually 1 April of the recruitment year).' },
        ],
      },
      {
        title: 'Age Relaxation',
        blocks: [
          { type: 'paragraph', text: 'Upper age relaxation is given to reserved categories as per Government of India rules. Typical relaxations are:' },
          {
            type: 'list',
            items: [
              'SC / ST: 5 years',
              'OBC (Non-Creamy Layer): 3 years',
              'Persons with Benchmark Disabilities: 10 years (additional relaxation for SC / ST / OBC)',
              'Ex-servicemen and other categories: as per the official notification',
            ],
          },
        ],
      },
      {
        title: 'Nationality',
        blocks: [
          { type: 'paragraph', text: 'Candidates should generally be a citizen of India. Certain other categories of candidates may also be eligible as defined in the official notification.' },
        ],
      },
      {
        title: 'Other Requirements',
        blocks: [
          {
            type: 'list',
            items: [
              'Candidates must meet the medical fitness standards set by the bank.',
              'Candidates must be able to read, write and speak the English language.',
              'The number of attempts and other conditions are as specified in the latest notification.',
            ],
          },
        ],
      },
    ],
    disclaimer:
      'Eligibility requirements may change. Students should always verify the latest official notification before applying.',
  },

  examPattern: {
    summary:
      'The SBI PO selection process has three phases. Phase I (Prelims) is a screening test with qualifying marks only. Phase II (Mains) consists of an objective test and a descriptive test. Phase III includes a Psychometric Test, Group Exercise and Interview. The final merit list is prepared from Phase II and Phase III marks.',
    stages: [
      {
        name: 'Phase I: Preliminary Examination',
        description: 'Online objective test. It is qualifying in nature and the marks are not counted in the final selection.',
        negativeMarking: '0.25 mark is deducted for each wrong answer.',
        negativeMarkingShort: '0.25 per wrong answer',
        sections: [
          { name: 'English Language', questions: 30, marks: 30, durationMinutes: 20 },
          { name: 'Quantitative Aptitude', questions: 35, marks: 35, durationMinutes: 20 },
          { name: 'Reasoning Ability', questions: 35, marks: 35, durationMinutes: 20 },
        ],
      },
      {
        name: 'Phase II: Main Examination',
        description: 'An objective test followed by a descriptive test (letter and essay) in English, taken on the computer.',
        negativeMarking: '0.25 mark is deducted for each wrong answer in the objective test.',
        negativeMarkingShort: '0.25 per wrong answer (objective)',
        sections: [
          { name: 'Reasoning & Computer Aptitude', questions: 45, marks: 60, durationMinutes: 60, negativeMarking: '0.25 per wrong answer' },
          { name: 'Data Analysis & Interpretation', questions: 35, marks: 60, durationMinutes: 45, negativeMarking: '0.25 per wrong answer' },
          { name: 'General / Economy / Banking Awareness', questions: 40, marks: 40, durationMinutes: 35, negativeMarking: '0.25 per wrong answer' },
          { name: 'English Language', questions: 35, marks: 40, durationMinutes: 40, negativeMarking: '0.25 per wrong answer' },
          { name: 'Descriptive Test (Letter & Essay)', questions: 2, marks: 50, durationMinutes: 30, negativeMarking: 'No' },
        ],
        notes: ['The objective sections together make up 155 questions and 200 marks in 3 hours. The descriptive test is held separately for 50 marks.'],
      },
      {
        name: 'Phase III: Psychometric Test, Group Exercise & Interview',
        description: 'Shortlisted candidates appear for a Psychometric Test, a Group Exercise and a personal Interview.',
        sections: [
          { name: 'Group Exercise', marks: 20 },
          { name: 'Interview', marks: 30 },
        ],
        notes: ['The Psychometric Test is for assessment and is not scored. The final selection is based on Phase II and Phase III marks.'],
      },
    ],
    disclaimer: 'The pattern is based on recent SBI notifications and may change. Check the official notification for the current year.',
  },

  syllabus: {
    officialUrl: null,
    stages: [
      {
        name: 'Preliminary Examination',
        subjects: [
          {
            name: 'English Language',
            topics: ['Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Fill in the Blanks', 'Error Spotting', 'Sentence Improvement', 'Vocabulary', 'Phrase Replacement'],
          },
          {
            name: 'Quantitative Aptitude',
            topics: ['Simplification and Approximation', 'Number Series', 'Quadratic Equations', 'Data Interpretation', 'Percentage', 'Ratio and Proportion', 'Profit and Loss', 'Simple and Compound Interest', 'Time and Work', 'Time, Speed and Distance', 'Mixture and Alligation', 'Probability, Permutation and Combination'],
          },
          {
            name: 'Reasoning Ability',
            topics: ['Puzzles', 'Seating Arrangement', 'Syllogism', 'Inequalities', 'Blood Relations', 'Direction Sense', 'Coding-Decoding', 'Input-Output', 'Order and Ranking', 'Data Sufficiency'],
          },
        ],
      },
      {
        name: 'Main Examination',
        subjects: [
          {
            name: 'Reasoning & Computer Aptitude',
            topics: ['Puzzles and Seating Arrangement', 'Syllogism and Inequalities', 'Logical Reasoning', 'Input-Output', 'Data Sufficiency', 'Basics of Computers', 'Computer Hardware and Software', 'MS Office', 'Networking and Internet', 'Computer Memory and Shortcuts'],
          },
          {
            name: 'Data Analysis & Interpretation',
            topics: ['Tabular, Bar, Line and Pie Charts', 'Caselet Data Interpretation', 'Radar and Missing Data Interpretation', 'Arithmetic Word Problems', 'Number Series', 'Quadratic Equations', 'Data Sufficiency'],
          },
          {
            name: 'General / Economy / Banking Awareness',
            topics: ['Current Affairs', 'Banking Awareness', 'Financial and Monetary Awareness', 'Indian Economy', 'Static General Knowledge', 'Government Schemes'],
          },
          {
            name: 'English Language',
            topics: ['Reading Comprehension', 'Cloze Test', 'Para Jumbles', 'Error Spotting', 'Fill in the Blanks', 'Vocabulary'],
          },
          {
            name: 'Descriptive Test',
            topics: ['Letter Writing', 'Essay Writing'],
          },
        ],
      },
    ],
  },

  // { year: 2024, stage: 'Prelims', shift: 'Shift 1', type: 'Memory based', viewUrl, downloadUrl, practiceUrl }
  // Add papers only when the file or the online test actually exists.
  previousYearPapers: [],

  // PLACEHOLDER: question count and duration of the sample free test.
  freeTests: [
    {
      id: 'sbi-po-free-mock-1',
      title: 'SBI PO Prelims Free Mock Test',
      questions: 100,
      durationMinutes: 60,
      type: 'Full-length mock test',
      startUrl: '/free-test/sbi-po',
    },
  ],

  // Shown only when the list has items. `href` is optional.
  resources: [
    {
      type: 'Practice Tests',
      title: 'SBI PO Test Series',
      description: 'Full-length, sectional and topic-wise tests with solutions and analysis.',
      href: '#test-series',
    },
    {
      type: 'Practice Tests',
      title: 'Free SBI PO Mock Test',
      description: 'Try the ExamCampus test platform with a free full-length mock.',
      href: '#free-test',
    },
    {
      type: 'Important Topics',
      title: 'SBI PO Syllabus',
      description: 'Stage-wise and subject-wise topics to plan your preparation.',
      href: '#syllabus',
    },
  ],

  faqs: [
    {
      question: 'What is SBI PO?',
      answer: 'SBI PO is the recruitment examination conducted by the State Bank of India to select Probationary Officers for the bank.',
    },
    {
      question: 'What are the stages of the SBI PO selection process?',
      answer: 'There are three phases: Phase I (Preliminary Examination), Phase II (Main Examination with a descriptive test) and Phase III (Psychometric Test, Group Exercise and Interview).',
    },
    {
      question: 'Is there negative marking in SBI PO?',
      answer: 'Yes. In the objective tests of the Prelims and the Mains, 0.25 mark is deducted for each wrong answer. There is no negative marking in the descriptive test.',
    },
    {
      question: 'Are Prelims marks counted in the final selection?',
      answer: 'No. The Preliminary Examination is qualifying in nature. The final merit list is prepared from the Main Examination and Phase III marks.',
    },
    {
      question: 'Who can apply for SBI PO?',
      answer: 'Graduates in any discipline who meet the age limit in the official notification can apply. Please see the Eligibility section above and always verify the latest notification.',
    },
    {
      question: 'Can I try an SBI PO mock test for free on ExamCampus?',
      answer: 'Yes. You can take a free SBI PO mock test to experience the ExamCampus test platform before you buy a Test Series.',
    },
    {
      question: 'What do I get with the SBI PO Test Series?',
      answer: 'The Test Series includes exam-focused mock tests, timed online tests, detailed solutions and a performance analysis after every test.',
    },
  ],

  // Cards for other exams. A card links to its hub page only once that exam is registered in ./index.js.
  relatedExams: [
    { slug: 'sbi-clerk', name: 'SBI Clerk', fullName: 'SBI Junior Associate', org: 'sbi' },
    { slug: 'ibps-po', name: 'IBPS PO', fullName: 'IBPS Probationary Officer', org: 'ibps' },
    { slug: 'ibps-clerk', name: 'IBPS Clerk', fullName: 'IBPS Clerical Cadre', org: 'ibps' },
    { slug: 'ibps-rrb', name: 'IBPS RRB', fullName: 'IBPS Regional Rural Banks', org: 'ibps' },
    { slug: 'rbi-grade-b', name: 'RBI Grade B', fullName: 'RBI Officer, Grade B', org: 'rbi' },
    { slug: 'lic-aao', name: 'LIC AAO', fullName: 'LIC Assistant Administrative Officer', org: 'lic' },
  ],
}

export default sbiPo
