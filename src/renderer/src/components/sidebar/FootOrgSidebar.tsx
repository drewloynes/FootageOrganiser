import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator
} from '@components/ui/sidebar'
import logo from '@resources/footage-organiser-logo-2.png'
import FootOrgSidebarBottom from './FootOrgSidebarBottom'
import FootOrgSidebarFoot from './FootOrgSidebarFoot'
import FootOrgSidebarTop from './FootOrgSidebarTop'

const fileName = 'FootOrgSidebar.tsx'
const area = 'sidebar'

function FootOrgSidebar(): React.ReactElement  {
  const funcName = 'FootOrgSidebar'
  log.rend(funcName, fileName, area)

  return (
    <Sidebar className="h-screen border-r">
      <SidebarHeader className="h-10">
        <img src={logo} alt="Corner Icon" className="absolute top-1 right-1 w-6 h-6 mt-2 mr-1" />
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
