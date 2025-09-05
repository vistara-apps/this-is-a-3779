import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ProjectCreator from './components/ProjectCreator'
import Analytics from './components/Analytics'
import Settings from './components/Settings'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [projects, setProjects] = useState([])

  const addProject = (project) => {
    setProjects(prev => [...prev, { ...project, id: Date.now() }])
    setActiveView('dashboard')
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard projects={projects} onCreateProject={() => setActiveView('create')} />
      case 'create':
        return <ProjectCreator onProjectCreated={addProject} onCancel={() => setActiveView('dashboard')} />
      case 'analytics':
        return <Analytics projects={projects} />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard projects={projects} onCreateProject={() => setActiveView('create')} />
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <div className="flex">
        <Sidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 lg:ml-64">
          {renderActiveView()}
        </main>
      </div>
    </div>
  )
}

export default App