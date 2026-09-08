import type { EditionCategory } from '@/data/cards'

interface CategorySelectorProps {
  categories: EditionCategory[]
  selected: string
  onSelect: (key: string) => void
}

export default function CategorySelector({ categories, selected, onSelect }: CategorySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const isActive = category.key === selected
        return (
          <button
            key={category.key}
            type="button"
            onClick={() => onSelect(category.key)}
            className={`rounded-3xl border px-5 py-3 text-left transition ${isActive ? 'border-brand-wine bg-brand-wine text-white shadow-soft' : 'border-brand-wine/10 bg-white text-brand-soft hover:border-brand-violet/20 hover:bg-brand-cream/80'}`}
          >
            <span className="block text-sm font-semibold">{category.label}</span>
            <span className="mt-1 block text-sm leading-6 text-[#675f58]">{category.description}</span>
          </button>
        )
      })}
    </div>
  )
}
