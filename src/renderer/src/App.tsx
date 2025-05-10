import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import AlertPopUp from './components/AlertPopUp'
import DraggableTopBar from './components/DraggableTopBar'
import RootLayout from './components/RootLayout'
import About from './components/body/About'
import CreateRule from './components/body/CreateRule'
import FootOrgBody from './components/body/FootOrgBody'
import FootOrgHeader from './components/body/FootOrgHeader'
import TermsAndConditions from './components/body/TermsAndConditions'
import EditRule from './components/body/edit-rule/EditRule'
import Help from './components/body/help/Help.'
import Settings from './components/body/settings/Settings'
import ApprovalList from './components/body/view-actions/ViewActions'
import ViewAllRules from './components/body/view-all/ViewAllRules'
import FootOrgSidebar from './components/sidebar/FootOrgSidebar'

const fileName: string = 'App.tsx'
const area: string = 'app'

function App() {
  const funcName: string = 'App'
  log.rend(funcName, fileName, area)

  return (
    <Router>
      <DraggableTopBar />
      <AlertPopUp />
      <RootLayout>
        <FootOrgSidebar />
        <FootOrgBody>
          <FootOrgHeader />
          <Routes>
            <Route path="/" element={<ViewAllRules />} />
            <Route path="/create-rule" element={<CreateRule />} />
            <Route path="/edit-rule/:ruleName" element={<EditRule />} />
            <Route path="/approval-list/:ruleName" element={<ApprovalList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </FootOrgBody>
      </RootLayout>
    </Router>
  )
}

export default App
