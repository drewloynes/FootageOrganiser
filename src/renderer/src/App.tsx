import { Route, HashRouter as Router, Routes } from 'react-router-dom'
import AlertPopUp from './components/AlertPopUp'
import About from './components/body/About'
import CreateRule from './components/body/CreateRule'
import EditRule from './components/body/edit-rule/EditRule'
import FootOrgBody from './components/body/FootOrgBody'
import FootOrgHeader from './components/body/FootOrgHeader'
import Help from './components/body/help/Help.'
import Settings from './components/body/settings/Settings'
import TermsAndConditions from './components/body/TermsAndConditions'
import ViewActions from './components/body/view-actions/ViewActions'
import ViewAllRules from './components/body/view-all/ViewAllRules'
import DraggableTopBar from './components/DraggableTopBar'
import RootLayout from './components/RootLayout'
import FootOrgSidebar from './components/sidebar/FootOrgSidebar'

const fileName = 'App.tsx'
const area = 'app'

function App(): React.ReactElement {
  const funcName = 'App'
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
            <Route path="/view-actions/:ruleName" element={<ViewActions />} />
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
