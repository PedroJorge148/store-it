'use client'

import Image from 'next/image'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { Models } from 'node-appwrite'
import { Thumbnail } from './thumbnail'
import { FormattedDateTime } from './formatted-date-time'
import { useDebounce } from '@/hooks/use-debounce'

export function Search() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<Models.Document[]>([])

  const path = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    async function fetchFiles() {
      if (!debouncedQuery) {
        console.log('here')
        setResults([])
        setOpen(false)
        return router.push(path.replace(searchParams.toString(), ''))
      }

      const files = await getFiles({ types: [], searchText: debouncedQuery })

      setResults(files.documents)
      setOpen(true)
    }
    fetchFiles()
  }, [debouncedQuery])

  useEffect(() => {
    if (!searchQuery) {
      setQuery('')
    }
  }, [searchQuery])

  function handleClickItem(file: Models.Document) {
    setOpen(false)
    setResults([])

    router.push(`/${file.type === 'video' || file.type === 'audio'
? 'media'
: file.type + 's'}?query=${debouncedQuery}`,
    )
  }

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <Image
          src="/assets/icons/search.svg"
          alt="Search"
          width={24}
          height={24}
        />
        <Input
          value={query}
          placeholder="Search..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0
              ? (
                  results.map((file) => (
                    <li
                      key={file.$id}
                      className="flex items-center justify-between"
                      onClick={() => handleClickItem(file)}
                    >
                      <div className="flex cursor-pointer items-center gap-4">
                        <Thumbnail
                          type={file.type}
                          extension={file.extension}
                          url={file.url}
                          className="size-9 min-w-9"
                        />
                        <p
                          className="subtitle-2 line-clamp-1 text-light-100"
                        >
                          {file.name}
                        </p>
                      </div>
                      <FormattedDateTime date={file.$createdAt} />
                    </li>
                  ))
                )
              : <p className="empty-result">No files found</p>}
          </ul>
        )}
      </div>
    </div>
  )
}
