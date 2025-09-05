import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import AuthWrapper from './components/auth/AuthWrapper'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import ProjectCreator from './components/ProjectCreator'
import Analytics from './components/Analytics'
import Settings from './components/Settings'
import { useAuthStore } from './store/authStore'
import { useProjectsStore } from './store/projectsStore'

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const { user, isAuthenticated } = useAuthStore()
  const { projects, fetchProjects, isLoading } = useProjectsStore()

  // Fetch user projects when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProjects(user.id)
    }
  }, [isAuthenticated, user, fetchProjects])

  const addProject = (project) => {
    // Project is automatically added to store by createProject action
    setActiveView('dashboard')
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard projects={projects} onCreateProject={() => setActiveView('create')} isLoading={isLoading} />
      case 'create':
        return <ProjectCreator onProjectCreated={addProject} onCancel={() => setActiveView('dashboard')} />
      case 'analytics':
        return <Analytics projects={projects} />
      case 'settings':
        return <Settings />
      default:
        return <Dashboard projects={projects} onCreateProject={() => setActiveView('create')} isLoading={isLoading} />
    }
  }

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-dark-bg text-dark-text">
        <div className="flex">
          <Sidebar activeView={activeView} onViewChange={setActiveView} />
          <main className="flex-1 lg:ml-64">
            {renderActiveView()}
          </main>
        </div>
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #374151',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#f9fafb',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#f9fafb',
              },
            },
          }}
        />
      </div>
    </AuthWrapper>
  )
}

export default App
