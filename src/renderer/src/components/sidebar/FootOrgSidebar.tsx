import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator
} from '@components/ui/sidebar'
import FootOrgSidebarBottom from './FootOrgSidebarBottom'
import FootOrgSidebarFoot from './FootOrgSidebarFoot'
import FootOrgSidebarTop from './FootOrgSidebarTop'

const fileName: string = 'FootOrgSidebar.tsx'
const area: string = 'sidebar'

function FootOrgSidebar() {
  const funcName: string = 'FootOrgSidebar'
  log.rend(funcName, fileName, area)

  return (
    <Sidebar className="h-screen border-r">
      <SidebarHeader className="h-10">
        <img
          src={'/footage-organiser-logo-2.png'}
          alt="Corner Icon"
          className="absolute top-1 right-1 w-6 h-6 mt-2 mr-1"
        />
      </SidebarHeader>
      <SidebarContent>
        <FootOrgSidebarTop />
        <SidebarSeparator className="mx-0" />
        <FootOrgSidebarBottom />
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        <FootOrgSidebarFoot />
      </SidebarFooter>
    </Sidebar>
  )
}

export default FootOrgSidebar
