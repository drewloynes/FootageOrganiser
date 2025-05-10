import { Logs, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { SidebarGroup, SidebarGroupContent, SidebarMenu } from '../ui/sidebar'
import SidebarItem from './SidebarItem'

const fileName: string = 'FootOrgSidebarBottom.tsx'
const area: string = 'sidebar'

function FootOrgSidebarBottom() {
  const funcName: string = 'FootOrgSidebarBottom'
  log.rend(funcName, fileName, area)

  const navigate = useNavigate()

  return (
    <SidebarGroup className="mt-auto ">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarItem
            tooltip={{
              children: 'Detailing all files and folders copied or deleted',
              hidden: false
            }}
            size={'sm'}
            onClick={() => {
              log.ipcSent('open-logs-folder', funcName, fileName, area)
              window.electron.openLogsFolder()
            }}
            className="cursor-pointer"
            icon={<Logs />}
            button_text="Logs"
          />
          <SidebarItem
            size={'sm'}
            onClick={() => navigate(`/settings`)}
            className="cursor-pointer"
            icon={<Settings />}
            button_text="Settings"
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default FootOrgSidebarBottom
