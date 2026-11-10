import { ArrowRight } from 'lucide-react'
import MenuLink from './MenuLink'
import SmartLink from '@/components/common/SmartLink'
import { iconFor } from '@/lib/icons'

export default function DropdownPanel({ item, onNavigate }) {
  return (
    <div
      id={`panel-${item.id}`}
      className={`absolute left-0 top-[calc(100%+0.65rem)] z-10 animate-pop rounded-xl border border-slate-200 bg-white p-2 shadow-xl shadow-primary-900/10 ${
        item.wide ? 'w-[28rem]' : 'w-72'
      }`}
    >
      <ul className={item.wide ? 'grid grid-cols-2' : ''}>
        {item.items.map((i) => (
          <li key={i.title}>
            <MenuLink {...i} icon={iconFor(i.icon) ?? undefined} onClick={onNavigate} />
          </li>
        ))}
      </ul>
      {item.footer && (
        <SmartLink
          href={item.footer.href ?? '#'}
          onClick={onNavigate}
          className="mt-1 flex items-center justify-between rounded-lg bg-surface px-3 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-accent-600"
        >
          {item.footer.label} <ArrowRight className="size-4" aria-hidden="true" />
        </SmartLink>
      )}
    </div>
  )
}
