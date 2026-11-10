import { ArrowRight } from 'lucide-react'

export default function AnnouncementBar() {
  return (
    <div className="bg-primary-900 text-primary-100">
      <div className="mx-auto flex w-full h-9 items-center justify-center gap-4 px-4 text-xs sm:justify-between sm:px-6 lg:px-12">
        <p className="truncate">
         
          <span className="hidden sm:inline">Learn, Practice &amp; Prepare for Every Important Exam — All in One Place</span>
          <span className="sm:hidden">Every important exam, all in one place</span>
        </p>
        <a
          href="#free-tests"
          className="group hidden shrink-0 items-center gap-1 font-semibold text-accent-400 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-accent-400 sm:inline-flex"
        >
          Explore Free Tests
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      </div>
    </div>
  )
}
