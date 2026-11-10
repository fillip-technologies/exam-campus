import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import BannerCarousel from '@/components/common/BannerCarousel'
import Carousel from '@/components/common/Carousel'
import CourseCard from '@/components/common/CourseCard'
import SmartLink from '@/components/common/SmartLink'
import { useSeries } from '@/api/public'
import { iconFor } from '@/lib/icons'
import HeroCategories from './HeroCategories'
import SeriesTabs from './SeriesTabs'

/**
 * Hero (category picker + banner carousel) followed by the tabbed test-series browser it controls.
 * section.data: { banners, tabs, categories, initialSeries }; the cards for other tab / category picks come from
 * GET /public/series (the tab rule runs on the server).
 */
export default function Hero({ section }) {
  const { title, anchorId, ctas, config = {}, data } = section
  const tabs = data.tabs
  const [categoryId, setCategoryId] = useState(null)
  const [tabId, setTabId] = useState(tabs[0]?.id ?? null)

  const isInitial = categoryId === null && tabId === data.initialSeries?.tab?.id
  const query = useSeries({ tab: tabId, category: categoryId }, { enabled: Boolean(tabId), initialData: isInitial ? data.initialSeries : undefined })

  const category = data.categories.find((c) => c.id === categoryId) ?? null
  const tab = tabs.find((t) => t.id === tabId)
  const items = query.data?.items ?? []
  const [primaryCta, secondaryCta] = [ctas.find((c) => c.role === 'primary'), ctas.find((c) => c.role === 'secondary')]
  const PrimaryIcon = iconFor(primaryCta?.icon)
  const seriesAnchor = config.seriesAnchorId || 'test-series'

  return (
    <>
      <section id={anchorId ?? 'home'} aria-label="Exam categories and featured test series" className="bg-surface">
        <div className="mx-auto space-y-4 px-4 py-4 sm:px-6 sm:py-5 lg:space-y-5 lg:px-12 lg:py-6">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
            {title && <h1 className="text-base font-semibold text-primary-900 sm:text-lg">{title}</h1>}
            {primaryCta?.href && (
              <SmartLink
                href={primaryCta.href}
                className="group inline-flex items-center gap-1.5 text-sm font-bold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:text-base"
              >
                {PrimaryIcon && <PrimaryIcon className="size-4 text-primary-600" aria-hidden="true" />}
                {primaryCta.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </SmartLink>
            )}
          </div>
          {data.categories.length > 0 && <HeroCategories categories={data.categories} activeId={categoryId} onChange={setCategoryId} />}
          {data.banners.length > 0 && (
            <div className="animate-fade-up">
              <BannerCarousel
                banners={data.banners}
                interval={config.carouselAutoplayMs ?? 5000}
                slideClass="basis-full lg:basis-[calc(50%-0.5rem)]"
              />
            </div>
          )}
        </div>
      </section>

      {tab && (
        <section id={seriesAnchor} aria-labelledby="series-title" className="scroll-mt-24 border-t border-slate-200 bg-white">
          <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-12 lg:py-8">
            <SeriesTabs tabs={tabs} activeId={tabId} onChange={setTabId} />

            <div id="st-panel" role="tabpanel" aria-labelledby={`st-tab-${tab.id}`} className="pt-5 lg:pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h2 id="series-title" className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
                  {tab.heading}
                  {category && <span className="ml-2 text-base font-medium text-slate-500">· {category.label}</span>}
                </h2>
                {secondaryCta?.href && (
                  <SmartLink
                    href={secondaryCta.href}
                    className="group inline-flex items-center gap-1.5 text-base font-bold text-primary-700 hover:text-primary-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                  >
                    {secondaryCta.label}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </SmartLink>
                )}
              </div>

              <div key={`${categoryId}-${tab.id}`} className={`mt-5 animate-fade-in transition-opacity ${query.isFetching && !query.isPending ? 'opacity-60' : ''}`}>
                {query.isPending ? (
                  <div className="h-80 animate-pulse rounded-xl bg-surface" aria-hidden="true" />
                ) : items.length > 0 ? (
                  <Carousel label={`${tab.label} test series, ${category?.label ?? 'all exams'}`}>
                    {items.map((p, i) => (
                      <CourseCard key={p.slug} product={p} toneIndex={i} />
                    ))}
                  </Carousel>
                ) : (
                  <p role="status" className="rounded-xl bg-surface px-5 py-10 text-center text-base text-slate-600">
                    No {tab.label.toLowerCase()} test series for {category?.label ?? 'all exams'} yet. Try another category or tab.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
