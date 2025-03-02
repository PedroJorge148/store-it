'use client'

import Image from 'next/image'
import { Input } from './ui/input'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { Models } from 'node-appwrite'
import { Thumbnail } from './thumbnail'
import { FormattedDateTime } from './formatted-date-time'

export function Search() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [results, setResults] = useState<Models.Document[]>([])

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('query') || ''

  useEffect(() => {
    async function fetchFiles() {
      // TODO remove types?
      const files = await getFiles({ types: [], searchText: query })

      setResults(files.documents)
      setOpen(true)
    }
    fetchFiles()
  }, [query])

  useEffect(() => {
    if (searchQuery) {
      setQuery('')
    }
  }, [searchQuery])

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
