import { useState } from 'react'
import { ArrowRight, PlayCircle } from 'lucide-react'
import BannerCarousel from '@/components/common/BannerCarousel'
import Carousel from '@/components/common/Carousel'
import CourseCard from '@/components/common/CourseCard'
import { heroBanners } from '@/data/banners'
import { heroCategories, seriesForCategory, seriesTabs } from '@/data/heroExplorer'
import HeroCategories from './HeroCategories'
import SeriesTabs from './SeriesTabs'

/** Hero (category picker + banner carousel) followed by the tabbed test-series browser it controls. */
export default function Hero() {
  const [categoryId, setCategoryId] = useState(null)
  const [tabId, setTabId] = useState(seriesTabs[0].id)

  const category = heroCategories.find((c) => c.id === categoryId) ?? null
  const tab = seriesTabs.find((t) => t.id === tabId)
  const items = tab.pick(seriesForCategory(category)).slice(0, tab.limit)

  return (
    <>
      <section id="home" aria-label="Exam categories and featured test series" className="bg-surface">
        <div className="mx-auto space-y-4 px-4 py-4 sm:px-6 sm:py-5 lg:space-y-5 lg:px-12 lg:py-6">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
            <h1 className="text-base font-semibold text-primary-900 sm:text-lg">Online test series for competitive and school exams</h1>
            <a
              href="#free-tests"
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:text-base"
            >
              <PlayCircle className="size-4 text-primary-600" aria-hidden="true" />
              Take a Free Test
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
          <HeroCategories activeId={categoryId} onChange={setCategoryId} />
          <div className="animate-fade-up">
            <BannerCarousel banners={heroBanners} slideClass="basis-full lg:basis-[calc(50%-0.5rem)]" />
          </div>
        </div>
      </section>

      <section id="test-series" aria-labelledby="series-title" className="scroll-mt-24 border-t border-slate-200 bg-white">
        <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
          <SeriesTabs activeId={tabId} onChange={setTabId} />

          <div
            id="st-panel"
            role="tabpanel"
            aria-labelledby={`st-tab-${tab.id}`}
            className="pt-5 lg:pt-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h2 id="series-title" className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
                {tab.heading}
                {category && <span className="ml-2 text-base font-medium text-slate-500">· {category.label}</span>}
              </h2>
              <a
                href="#all-test-series"
                className="group inline-flex items-center gap-1.5 text-base font-bold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              >
                View All
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            </div>

            <div key={`${categoryId}-${tab.id}`} className="animate-fade-in mt-5">
              {items.length > 0 ? (
                <Carousel label={`${tab.label} test series, ${category?.label ?? "all exams"}`}>
                  {items.map((p, i) => (
                    <CourseCard key={p.slug} product={p} toneIndex={i} />
                  ))}
                </Carousel>
              ) : (
                <p role="status" className="rounded-xl bg-surface px-5 py-10 text-center text-base text-slate-600">
                  No {tab.label.toLowerCase()} test series for {category?.label ?? "all exams"} yet. Try another category or tab.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
