/**
 * Class 6: master data for the Academic Class Hub page (/academic/class-6).
 *
 * Every section of the page reads from this object. To add another class, copy this file,
 * change the values and register it in ./index.js.
 *
 * Rules for this data:
 *  - Only the Test Series product exists for academic classes for now.
 *  - Sections marked PLACEHOLDER hold sample values for ExamCampus's own products
 *    (prices, test counts). Replace them with real values before launch.
 *  - Topics follow the common NCERT-based Class 6 curriculum. Chapter names and order differ by
 *    board, school and edition, so review them against the books your students use.
 */
const class6 = {
  slug: 'class-6',
  name: 'Class 6',
  grade: 6,
  stage: 'Classes 6–8',
  category: 'Academic',
  boards: ['CBSE', 'ICSE', 'State Boards'],
  description:
    'Class 6 is where students move from primary to middle school and subjects become more detailed. Practise chapter by chapter with timed online tests, understand every answer with solutions, and see exactly which topics need more work.',

  quickInfo: [
    { label: 'Class', value: '6 (Middle School)' },
    { label: 'Boards', value: 'CBSE · ICSE · State Boards' },
    { label: 'Subjects', value: '5 core subjects' },
    { label: 'Medium', value: 'English · Hindi' },
    { label: 'Test Mode', value: 'Online, timed' },
    { label: 'Test Types', value: 'Chapter · Unit · Full syllabus' },
  ],

  // PLACEHOLDER: replace prices and counts with real product data.
  testSeries: [
    {
      id: 'class-6-test-series',
      title: 'Class 6 Test Series',
      subtitle: 'All subjects · CBSE, ICSE & State Boards',
      stats: [
        { label: 'Total tests', value: 250 },
        { label: 'Chapter-wise tests', value: 150 },
        { label: 'Unit tests', value: 60 },
        { label: 'Full syllabus tests', value: 40 },
        { label: 'Subjects', value: 5 },
        { label: 'Medium', value: 'English · Hindi' },
        { label: 'Validity', value: '12 Months' },
      ],
      validity: '12 Months',
      price: 599,
      originalPrice: 1999,
      includes: [
        'Chapter-wise tests for every subject',
        'Timed online tests',
        'Detailed solutions',
        'Chapter-wise performance analysis',
      ],
      enrollUrl: '/enroll/class-6',
      detailsUrl: '#test-series/class-6',
    },
  ],

  subjects: [
    {
      name: 'Mathematics',
      summary: 'Build number sense, geometry and problem-solving skills.',
      testTypes: ['Chapter-wise tests', 'Unit tests', 'Full syllabus tests'],
      topics: [
        'Knowing and Playing with Numbers',
        'Whole Numbers and Integers',
        'Factors, Multiples and Prime Numbers',
        'Fractions and Decimals',
        'Ratio and Proportion',
        'Introduction to Algebra',
        'Basic Geometrical Ideas and Shapes',
        'Perimeter and Area',
        'Data Handling',
        'Symmetry',
      ],
    },
    {
      name: 'Science',
      summary: 'Explore living things, materials, motion, light and electricity.',
      testTypes: ['Chapter-wise tests', 'Unit tests', 'Full syllabus tests'],
      topics: [
        'Food and its Components',
        'Fibre to Fabric',
        'Sorting and Separating Materials',
        'Changes Around Us',
        'Plants and Their Parts',
        'Body Movements',
        'Living Organisms and Their Surroundings',
        'Motion and Measurement',
        'Light, Shadows and Reflections',
        'Electricity and Circuits',
        'Magnets',
        'Water and Air',
      ],
    },
    {
      name: 'English',
      summary: 'Improve reading, grammar, vocabulary and writing.',
      testTypes: ['Chapter-wise tests', 'Unit tests', 'Full syllabus tests'],
      topics: [
        'Reading Comprehension',
        'Nouns, Pronouns and Adjectives',
        'Verbs and Tenses',
        'Articles and Prepositions',
        'Vocabulary and Word Usage',
        'Paragraph, Letter and Notice Writing',
        'Prose and Poetry',
      ],
    },
    {
      name: 'Hindi',
      summary: 'Strengthen reading, grammar and writing in Hindi.',
      testTypes: ['Chapter-wise tests', 'Unit tests', 'Full syllabus tests'],
      topics: [
        'Unseen Passage (अपठित गद्यांश)',
        'Grammar: Noun, Pronoun, Verb, Adjective',
        'Vocabulary and Word Usage',
        'Letter and Essay Writing',
        'Prose and Poetry',
      ],
    },
    {
      name: 'Social Science',
      summary: 'Understand history, geography and how society is governed.',
      testTypes: ['Chapter-wise tests', 'Unit tests', 'Full syllabus tests'],
      topics: [
        'History: Early Humans and Early Kingdoms',
        'Geography: The Earth, Maps and Landforms',
        'Geography: India, Climate and Resources',
        'Civics: Diversity and Unity',
        'Civics: Government and Local Government',
      ],
    },
  ],

  howItWorks: [
    { title: 'Choose a subject and chapter', text: 'Pick the chapter you have just studied, or a full syllabus test before exams.' },
    { title: 'Take a timed online test', text: 'Answer questions in a focused exam-style screen, on a phone, tablet or computer.' },
    { title: 'Review solutions and analysis', text: 'See every solution and find the chapters that need more practice.' },
  ],

  // PLACEHOLDER: question count and duration of the sample free test.
  freeTests: [
    {
      id: 'class-6-free-maths-1',
      title: 'Class 6 Mathematics Free Chapter Test',
      questions: 20,
      durationMinutes: 30,
      type: 'Chapter-wise test',
      startUrl: '/free-test/class-6',
    },
  ],

  faqs: [
    {
      question: 'Which boards does the Class 6 Test Series cover?',
      answer: 'The tests follow the common Class 6 curriculum used by CBSE, ICSE and most State Boards. Chapter names and order can differ slightly by board, so the test details show the topics covered.',
    },
    {
      question: 'Which subjects are included?',
      answer: 'Mathematics, Science, English, Hindi and Social Science.',
    },
    {
      question: 'What types of tests are there?',
      answer: 'There are chapter-wise tests, unit tests and full syllabus tests, so students can practise right after a chapter and again before exams.',
    },
    {
      question: 'Can my child take the tests on a phone?',
      answer: 'Yes. The tests run online in a timed exam-style screen on a phone, tablet or computer.',
    },
    {
      question: 'Will my child get solutions and analysis?',
      answer: 'Yes. After every test your child can see the solutions and a chapter-wise performance analysis.',
    },
    {
      question: 'Can we try a test for free first?',
      answer: 'Yes. You can take a free Class 6 test to see how the ExamCampus test platform works before you buy the Test Series.',
    },
  ],

  // Other class hubs. A card links to its page only once that class is registered in ./index.js.
  relatedClasses: [
    { slug: 'class-7', name: 'Class 7', stage: 'Classes 6–8' },
    { slug: 'class-8', name: 'Class 8', stage: 'Classes 6–8' },
    { slug: 'class-9', name: 'Class 9', stage: 'Classes 9–10' },
    { slug: 'class-10', name: 'Class 10', stage: 'Classes 9–10' },
    { slug: 'class-11', name: 'Class 11', stage: 'Classes 11–12' },
    { slug: 'class-12', name: 'Class 12', stage: 'Classes 11–12' },
  ],
}

export default class6
