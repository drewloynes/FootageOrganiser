import { RootLayout } from './components/RootLayout'
import { Sidebar } from './components/sidebar/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ViewAllRules from './components/body/ViewAllRules'
import Title from './components/body/Title'
import { DraggableTopBar } from './components/DraggableTopBar'
import { Body } from './components/body/Body'
import Help from './components/body/Help.'
import About from './components/body/About'
import Settings from './components/body/settings/Settings'
import Confirmation from './components/body/confirmation/Confirmation'
import EditRule from './components/body/edit/EditRule'
import CreateNewRule from './components/body/CreateNewRule'
import ApprovalList from './components/body/action-list/ApprovalList'

function App() {
  return (
    <Router>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2" />
        <Body>
          <Title />
          <Routes>
            <Route path="/" element={<ViewAllRules />} />
            <Route path="/create-rule" element={<CreateNewRule />} />
            <Route path="/edit-rule/:ruleName" element={<EditRule />} />
            <Route path="/approval-list/:ruleName" element={<ApprovalList />} />
            <Route path="/Confirmation" element={<Confirmation />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
          </Routes>
        </Body>
      </RootLayout>
    </Router>
  )
}

export default App
