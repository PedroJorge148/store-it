'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  Select, SelectContent,
  SelectItem, SelectTrigger, SelectValue,
} from './ui/select'
import { sortTypes } from '@/constants'

export function Sort() {
  const path = usePathname()
  const router = useRouter()

  function handleSort(value: string) {
    router.push(`${path}?sort=${value}`)
  }

  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.value}
            value={sort.value}
            className="shad-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
