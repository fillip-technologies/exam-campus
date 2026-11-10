import {
  FileText, GraduationCap, Landmark, MapPinned, Scale, Shield, TrainFront,
} from 'lucide-react'
import { slugify } from '@/lib/slugify'

// Each exam is [name, org]. `org` names the conducting body and doubles as the
// logo file key: drop /public/images/exam-logos/<org>.png (or .svg) to replace the monogram.
const category = (id, label, icon, exams) => ({
  id,
  label,
  icon,
  exams: exams.map(([name, org]) => ({ name, org, slug: slugify(name) })),
})

/** Data for the Competitive Exams mega menu (desktop) and its mobile accordion. */
export const competitiveMenu = [
  category('teaching', 'Teaching', GraduationCap, [
    ['BPSC TRE', 'bpsc'], ['CTET', 'cbse'], ['Bihar STET', 'bseb'], ['KVS', 'kvs'], ['NVS', 'nvs'], ['DSSSB', 'dsssb'],
  ]),
  category('ssc', 'SSC', FileText, [
    ['SSC CGL', 'ssc'], ['SSC CHSL', 'ssc'], ['SSC MTS', 'ssc'], ['SSC GD', 'ssc'], ['SSC CPO', 'ssc'], ['SSC Stenographer', 'ssc'],
  ]),
  category('banking', 'Banking & Insurance', Landmark, [
    ['SBI PO', 'sbi'], ['SBI Clerk', 'sbi'], ['IBPS PO', 'ibps'], ['IBPS Clerk', 'ibps'], ['IBPS RRB', 'ibps'],
    ['RBI Grade B', 'rbi'], ['LIC AAO', 'lic'], ['NIACL AO', 'niacl'],
  ]),
  category('railway', 'Railway', TrainFront, [
    ['RRB NTPC', 'rrb'], ['RRB Group D', 'rrb'], ['RRB ALP', 'rrb'], ['RRB JE', 'rrb'], ['RPF Constable', 'rpf'],
  ]),
  category('upsc-psc', 'UPSC & PSC', Scale, [
    ['UPSC CSE', 'upsc'], ['BPSC', 'bpsc'], ['UPPSC', 'uppsc'], ['MPPSC', 'mppsc'], ['RPSC RAS', 'rpsc'],
  ]),
  category('defence', 'Defence', Shield, [
    ['NDA', 'nda'], ['CDS', 'upsc'], ['AFCAT', 'iaf'], ['CAPF', 'upsc'], ['Agniveer', 'agniveer'],
  ]),
  category('state', 'State Government Exams', MapPinned, [
    ['State Police Constable', 'police'], ['State Police SI', 'police'], ['Patwari', 'state'],
    ['Forest Guard', 'forest'], ['Secretariat Assistant', 'state'],
  ]),
]
