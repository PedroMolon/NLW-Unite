import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

interface IconButtonProps extends ComponentProps<'button'> {
  transparent?: boolean
}

export function IconButton({ transparent, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        'border border-white/10 rounded-md p-1.5 hover:outline-none hover:ring-1 hover:ring-zinc-300',
        transparent ? 'bg-black/20' : 'bg-zinc-700',
        props.disabled ? 'opacity-50' : null,
      )}
    />
  )
}
