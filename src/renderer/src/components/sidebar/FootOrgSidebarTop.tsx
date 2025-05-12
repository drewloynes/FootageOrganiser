import { ChevronDown, ChevronRight, List, Pause, Plus, PowerOff, RefreshCcw } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub
} from '../ui/sidebar'
import SidebarItem from './SidebarItem'

const fileName: string = 'FootOrgSidebarTop.tsx'
const area: string = 'sidebar'

function FootOrgSidebarTop() {
  const funcName: string = 'FootOrgSidebarTop'
  log.rend(funcName, fileName, area)

  const [openControlRules, setOpenControlRules] = useState(false)

  const navigate = useNavigate()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarItem
            onClick={() => navigate(`/`)}
            className="h-12 cursor-pointer"
            icon={<List />}
            button_text="All Rules"
          />
          <SidebarItem
            onClick={() => navigate(`/create-rule`)}
            className="h-12 cursor-pointer"
            icon={<Plus />}
            button_text="Create Rule"
          />
          <SidebarMenuItem>
            <Collapsible
              open={openControlRules}
              onOpenChange={setOpenControlRules}
              className="group/collapsible mt-2"
            >
              <CollapsibleTrigger className="h-8 cursor-pointer" asChild>
                <SidebarMenuButton className="justify-start mb-2">
                  {openControlRules ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  Control Rules
                </SidebarMenuButton>
              </CollapsibleTrigger>

              <CollapsibleContent className="space-y-1">
                <SidebarMenuSub>
                  <SidebarItem
                    onClick={() => {
                      log.ipcSent('evaluate-all-rules', funcName, fileName, area)
                      window.electron.evaluateAllRules()
                    }}
                    className="data-[active=true]:bg-transparent cursor-pointer"
                    icon={<RefreshCcw />}
                    button_text="Evaluate All"
                  />
                  <SidebarItem
                    onClick={() => {
                      log.ipcSent('stop-all-rules', funcName, fileName, area)
                      window.electron.stopAllRules()
                    }}
                    className="text-red-800 hover:text-red-600 data-[active=true]:bg-transparent cursor-pointer"
                    icon={<Pause />}
                    button_text="Stop All"
                  />
                  <SidebarItem
                    onClick={() => {
                      log.ipcSent('disable-all-rules', funcName, fileName, area)
                      window.electron.disableAllRules()
                    }}
                    className="text-black hover:text-black font-medium hover:font-semibold data-[active=true]:bg-transparent cursor-pointer"
                    icon={<PowerOff />}
                    button_text="Disable All"
                  />
                </SidebarMenuSub>
              </CollapsibleContent>
            </Collapsible>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default FootOrgSidebarTop
