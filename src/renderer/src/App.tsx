import { RootLayout } from './components/RootLayout'
import { Sidebar } from './components/sidebar/Sidebar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainContent from './components/body/MainContent'
import CreateRuleForm from './components/body/rule-form/CreateRuleForm'
import Title from './components/body/Title'
import { DraggableTopBar } from './components/DraggableTopBar'
import { Body } from './components/body/Body'

function App() {
  return (
    <Router>
      <DraggableTopBar />
      <RootLayout>
        <Sidebar className="p-2" />
        <Body>
          <Title />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/create-rule" element={<CreateRuleForm />} />
          </Routes>
        </Body>
      </RootLayout>
    </Router>
  )
}

export default App
