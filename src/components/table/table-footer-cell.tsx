import { ComponentProps } from 'react'

interface TableFooterCellProps extends ComponentProps<'td'> {
  right?: boolean
}

export function TableFooterCell({ right, ...props }: TableFooterCellProps) {
  return (
    <td
      {...props}
      colSpan={3}
      className={
        right
          ? 'py-3 px-4 text-sm text-right text-zinc-300'
          : 'py-3 px-4 text-sm text-zinc-300'
      }
    />
  )
}
