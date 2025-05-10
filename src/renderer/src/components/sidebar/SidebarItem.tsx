import { TooltipContentProps } from '@radix-ui/react-tooltip'
import { SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

const fileName: string = 'SidebarItem.tsx'
const area: string = 'sidebar'

function SidebarItem({
  button_text = '',
  icon = undefined,
  tooltip = '',
  size = 'default',
  onClick = () => {},
  className = ''
}: {
  button_text?: string
  icon?: React.ReactNode | undefined
  tooltip?: string | (TooltipContentProps & React.RefAttributes<HTMLDivElement>) | undefined
  size?: 'default' | 'sm' | 'lg' | null | undefined
  onClick?: () => void
  className?: string
}) {
  const funcName: string = 'SidebarItem'
  log.rend(funcName, fileName, area)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton tooltip={tooltip} size={size} onClick={onClick} className={className}>
        {icon}
        {button_text}
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default SidebarItem
