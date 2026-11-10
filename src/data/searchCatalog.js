export const popularSearches = ['BPSC TRE', 'SSC CGL', 'Banking', 'Railway', 'Class 10']

const exams = (category, names) => names.map((name) => ({ name, category }))

export const searchableCourses = [
  ...['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'].map((name) => ({
    name,
    category: 'Academic',
  })),
  ...exams('Teaching', ['BPSC TRE', 'CTET', 'STET', 'KVS', 'NVS', 'DSSSB']),
  ...exams('SSC', ['SSC CGL', 'SSC CHSL', 'SSC MTS', 'SSC GD', 'SSC CPO']),
  ...exams('Banking', ['Banking (all exams)', 'SBI PO', 'SBI Clerk', 'IBPS PO', 'IBPS Clerk', 'RBI']),
  ...exams('Railway', ['Railway (all exams)', 'RRB NTPC', 'RRB Group D', 'RRB ALP']),
  ...exams('Civil Services', ['UPSC CSE', 'BPSC', 'State PSC']),
  ...exams('Defence', ['NDA', 'CDS', 'AFCAT', 'CAPF']),
  ...exams('Insurance', ['LIC AAO', 'NIACL AO']),
]
