import { cn, formatDateTime } from '@/lib/utils'

interface Props {
  date: string
  className?: string
}

export function FormattedDateTime({ date, className }: Props) {
  return (
    <p className={cn('body-1 text-light-100', className)}>
      {formatDateTime(date)}
    </p>
  )
}
