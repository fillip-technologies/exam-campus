import { BarChart3, ClipboardCheck, History, LayoutList, ListChecks, Timer } from 'lucide-react'
import { slugify } from '@/lib/slugify'

// PLACEHOLDER product data: replace prices and counts with real values.
// `org` is the logo key (see /public/exam-logos). Add `image` to use a real poster.
const posterIcons = [
  { icon: ClipboardCheck, label: 'Mock Tests' },
  { icon: Timer, label: 'Timed' },
  { icon: BarChart3, label: 'Analysis' },
  { icon: History, label: 'PYPs' },
]

const features = [
  { icon: ClipboardCheck, value: '30+', label: 'Full-length Mocks' },
  { icon: LayoutList, value: '100+', label: 'Sectional Tests' },
  { icon: ListChecks, value: '200+', label: 'Topic-wise Tests' },
  { icon: History, value: '10+', label: 'Previous Year Papers' },
]

// rows: [exam, org, stages, poster image (optional)]; `pricing` applies to the whole category
const series = (rows, { price, mrp }) =>
  rows.map(([exam, org, stages, image], i) => ({
    exam,
    org,
    slug: slugify(exam),
    title: `${exam} Test Series`,
    subtitle: 'Test Series',
    language: 'Hinglish',
    tag: stages,
    validity: '12 Months',
    price,
    mrp,
    features,
    posterIcons,
    offer: i % 3 === 0 ? 'Limited-time offer' : undefined,
    image,
  }))

export const testSeriesCategories = [
  {
    id: 'banking',
    label: 'Banking & Insurance',
    items: series(
      [
        ['SBI PO', 'sbi', 'Prelims + Mains', '/images/posters/sbi-po.jpg'],
        ['SBI Clerk', 'sbi', 'Prelims + Mains', '/images/posters/sbi-clerk.jpg'],
        ['IBPS PO', 'ibps', 'Prelims + Mains', '/images/posters/ibps-po.jpg'],
        ['IBPS Clerk', 'ibps', 'Prelims + Mains', '/images/posters/ibps-clerk.jpg'],
        ['RBI Grade B', 'rbi', 'Phase I + II'],
        ['RBI Assistant', 'rbi', 'Prelims + Mains'],
        ['LIC AAO', 'lic', 'Prelims + Mains'],
        ['NIACL Assistant', 'niacl', 'Prelims + Mains'],
      ],
      { price: 799, mrp: 2499 },
    ),
  },
  {
    id: 'ssc',
    label: 'SSC',
    items: series(
      [
        ['SSC CGL', 'ssc', 'Tier 1 + Tier 2'],
        ['SSC CHSL', 'ssc', 'Tier 1 + Tier 2'],
        ['SSC MTS', 'ssc', 'Session 1 + 2'],
        ['SSC GD', 'ssc', 'CBT'],
        ['SSC CPO', 'ssc', 'Paper 1 + 2'],
        ['SSC Stenographer', 'ssc', 'CBT'],
      ],
      { price: 699, mrp: 2199 },
    ),
  },
  {
    id: 'teaching',
    label: 'Teaching',
    items: series(
      [
        ['BPSC TRE', 'bpsc', 'Full syllabus'],
        ['CTET', 'cbse', 'Paper 1 + 2'],
        ['Bihar STET', 'bseb', 'Paper 1 + 2'],
        ['KVS', 'kvs', 'Full syllabus'],
        ['NVS', 'nvs', 'Full syllabus'],
        ['DSSSB', 'dsssb', 'Tier 1 + Tier 2'],
      ],
      { price: 599, mrp: 1999 },
    ),
  },
  {
    id: 'railway',
    label: 'Railway',
    items: series(
      [
        ['RRB NTPC', 'rrb', 'CBT 1 + CBT 2'],
        ['RRB Group D', 'rrb', 'CBT'],
        ['RRB ALP', 'rrb', 'CBT 1 + CBT 2'],
        ['RRB JE', 'rrb', 'CBT 1 + CBT 2'],
        ['RPF Constable', 'rpf', 'CBT'],
      ],
      { price: 599, mrp: 1999 },
    ),
  },
  {
    id: 'upsc-psc',
    label: 'UPSC & State PSC',
    items: series(
      [
        ['UPSC CSE Prelims', 'upsc', 'GS + CSAT'],
        ['BPSC', 'bpsc', 'Prelims + Mains'],
        ['UPPSC', 'uppsc', 'Prelims + Mains'],
        ['MPPSC', 'mppsc', 'Prelims + Mains'],
        ['RPSC RAS', 'rpsc', 'Prelims + Mains'],
      ],
      { price: 1499, mrp: 4999 },
    ),
  },
  {
    id: 'defence',
    label: 'Defence',
    items: series(
      [
        ['NDA', 'nda', 'Maths + GAT'],
        ['CDS', 'upsc', 'English + GK + Maths'],
        ['AFCAT', 'iaf', 'AFCAT + EKT'],
        ['CAPF', 'upsc', 'Paper 1 + 2'],
        ['Agniveer', 'agniveer', 'CEE'],
      ],
      { price: 699, mrp: 2199 },
    ),
  },
]

export const allTestSeries = testSeriesCategories.flatMap((c) => c.items)
