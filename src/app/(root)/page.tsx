import { ActionsDropdown } from '@/components/action-dropdown'
import { Chart } from '@/components/chart'
import { FormattedDateTime } from '@/components/formatted-date-time'
import { Thumbnail } from '@/components/thumbnail'
import { Separator } from '@/components/ui/separator'
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions'
import { convertFileSize, getUsageSummary } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Models } from 'node-appwrite'

export default async function Home() {
  const [files, totalSpace] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
  ])

  const usageSummary = getUsageSummary(totalSpace)

  return (
    <div className="dashboard-container">
      <section>
        <Chart used={totalSpace.used} />

        <ul className="dashboard-summary-list">
          {usageSummary.map((summary) => (
            <Link
              key={summary.title}
              href={summary.url}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <Image
                    src={summary.icon}
                    alt="Uploaded image"
                    width={100}
                    height={100}
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>
                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-light-400" />
                <FormattedDateTime
                  date={summary.latestDate}
                  className="text-center"
                />
              </div>
            </Link>
          ))}
        </ul>
      </section>

      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h2 text-light-100">Recent files uploaded</h2>
        {files.documents.length > 0
          ? (
            <ul className="mt-5 flex flex-col gap-5">
              {files.documents.map((file: Models.Document) => (
                <Link
                  key={file.$id}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3"
                >
                  <Thumbnail
                    type={file.type}
                    extension={file.extension}
                    url={file.url}
                  />

                  <div className="recent-file-details">
                    <div className="flex flex-col gap-1">
                      <p title={file.name} className="recent-file-name">
                        {file.name}
                      </p>
                      <FormattedDateTime
                        date={file.$createdAt} className="caption"
                      />
                    </div>
                    <ActionsDropdown file={file} />
                  </div>
                </Link>
              ))}
            </ul>
            )
          : (
            <p className="empty-list">No files uploaded</p>
            )}
      </section>
    </div>
  )
}
