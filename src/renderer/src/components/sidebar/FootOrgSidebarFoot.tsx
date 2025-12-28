import {
  Bug,
  CircleHelp,
  GitPullRequest,
  Handshake,
  Info,
  LogOut,
  MoreHorizontal
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '../ui/sidebar'

const fileName = 'FootOrgSidebarFoot.tsx'
const area = 'sidebar'

function FootOrgSidebarFoot(): React.ReactElement  {
  const funcName = 'FootOrgSidebarFoot'
  log.rend(funcName, fileName, area)

  const navigate = useNavigate()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => navigate(`/help`)} className="cursor-pointer">
          <CircleHelp />
          Help
        </SidebarMenuButton>
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <SidebarMenuAction>
              <MoreHorizontal />
            </SidebarMenuAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start">
            <DropdownMenuLabel className="text-end text-[10px] h-4 text-gray-600 absolute top-0 right-0">
              Version {FOOTAGE_ORGANISER_VERSION}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="mt-5" />
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/about`)}>
              <Info />
              About
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/help`)}>
              <CircleHelp />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                log.ipcSent('open-report-bug', funcName, fileName, area)
                window.electron.openReportBug()
              }}
            >
              <Bug />
              Report Bug
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                log.ipcSent('open-github', funcName, fileName, area)
                window.electron.openGithub()
              }}
            >
              <GitPullRequest />
              GitHub
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => navigate(`/terms-and-conditions`)}
            >
              <Handshake />
              Terms & Conditions
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-800 cursor-pointer"
              onClick={() => {
                log.ipcSent('quit', funcName, fileName, area)
                window.electron.quit()
              }}
            >
              <LogOut className="text-red-800" />
              Quit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default FootOrgSidebarFoot
