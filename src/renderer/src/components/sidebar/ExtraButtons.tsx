import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

const fileName: string = 'ExtraButtons.tsx'
const area: string = 'sidebar'

export const ExtraButtons = ({ className, ...props }: ComponentProps<'div'>) => {
  const funcName: string = 'ExtraButtons'
  log.rend(funcName, fileName, area)

  return (
    <div className={twMerge('mt-5', className)} {...props}>
      <button
        className="w-full py-2 mb-4 bg-blue-500 hover:bg-blue-600 rounded"
        onClick={() => window.electron.openLogsFolder()}
      >
        Logs
      </button>
      <hr
        style={{
          color: 'red',
          backgroundColor: 'red',
          height: 5
        }}
      />
    </div>
  )
}
