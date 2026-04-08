import { useEffect, useState } from 'react'
import { Counter } from './components/Counter'
import { Input } from './components/Input'
import { HomeDirectoryFiles } from './components/HomeDirectoryFiles'
import { Login } from './components/Login'
import { Buttons } from './components/Buttons'
import { DSVisualizer } from './components/DSVisualizer'
import { ReactArchDiagram } from './components/ReactArchDiagram'
import { InterviewPrep } from './components/InterviewPrep'
import { useAuthStore } from './store/authStore'
import './App.css'

type Page = 'playground' | 'ds' | 'arch' | 'interview' | 'dsa-drill'

function App() {
  const { token, user, logout, verify } = useAuthStore()
  const [page, setPage] = useState<Page>('playground')

  useEffect(() => { verify() }, [verify])

  if (!token) return <Login />

  return (
    <div className="app-container">
      <header className="title-container">
        <h1 className="title">Zustand Playground</h1>
        <p className="subtitle">React state management made simple</p>
      </header>

      {/* ── Top Nav ── */}
      <nav className="app-nav">
        <div className="app-nav-tabs">
          <button
            className={`app-nav-tab ${page === 'playground' ? 'active' : ''}`}
            onClick={() => setPage('playground')}
          >
            Playground
          </button>
          <button
            className={`app-nav-tab ${page === 'ds' ? 'active' : ''}`}
            onClick={() => setPage('ds')}
          >
            Data Structures
          </button>
          <button
            className={`app-nav-tab ${page === 'arch' ? 'active' : ''}`}
            onClick={() => setPage('arch')}
          >
            React Architecture
          </button>
          <button
            className={`app-nav-tab ${page === 'interview' ? 'active' : ''}`}
            onClick={() => setPage('interview')}
          >
            Interview Prep
          </button>
          <button
            className={`app-nav-tab ${page === 'dsa-drill' ? 'active' : ''}`}
            onClick={() => setPage('dsa-drill')}
          >
            DSA Drill 1
          </button>
        </div>
        <div className="app-nav-user">
          <span className="app-nav-name">{user?.name ?? '...'}</span>
          {user?.role && <span className="app-nav-role">{user.role}</span>}
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={logout}>
            Sign Out
          </button>
        </div>
      </nav>

      {page === 'playground' && (
        <main className="main-layout">
          <div className="left-column">
            <Counter />
            <Input />
          </div>
          <div className="right-column" style={{ flexDirection: 'row', alignItems: 'start', gap: '2rem' }}>
            <HomeDirectoryFiles />
            <Buttons />
          </div>
        </main>
      )}

      {page === 'ds' && (
        <main>
          <DSVisualizer />
        </main>
      )}

      {page === 'arch' && (
        <main>
          <ReactArchDiagram />
        </main>
      )}

      {page === 'interview' && (
        <main style={{ padding: '0 1rem' }}>
          <InterviewPrep />
        </main>
      )}

      {page === 'dsa-drill' && (
        <main style={{ padding: 0, height: 'calc(100vh - 80px)' }}>
          <iframe 
            src="/dsa_pattern_drill_1.html" 
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: '12px' }} 
            title="DSA Pattern Drill 1" 
          />
        </main>
      )}
    </div>
  )
}

export default App
