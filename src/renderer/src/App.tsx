// import { Route, Router, Routes } from "react-router-dom"
// import { DraggableTopBar } from "./components/DraggableTopBar"
// import { RootLayout } from "./components/RootLayout"
// import { Body } from "./components/body/Body"
// import { Sidebar } from "./components/sidebar/Sidebar"
// import Title from "./components/body/Title"
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { DraggableTopBar } from './components/DraggableTopBar'
import { RootLayout } from './components/RootLayout'
import About from './components/body/About'
import { Body } from './components/body/Body'
import CreateNewRule from './components/body/CreateNewRule'
import Help from './components/body/Help.'
import Title from './components/body/Title'
import ViewAllRules from './components/body/ViewAllRules'
import ApprovalList from './components/body/action-list/ApprovalList'
import EditRule from './components/body/edit/EditRule'
import Settings from './components/body/settings/Settings'
import { Sidebar } from './components/sidebar/Sidebar'

const fileName: string = 'App.tsx'
const area: string = 'app'

function App() {
  const funcName: string = 'App'
  log.rend(funcName, fileName, area)

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
