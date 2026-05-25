import { useState } from 'react'
import { Counter } from './components/Counter'
import { Input } from './components/Input'
import { HomeDirectoryFiles } from './components/HomeDirectoryFiles'
// import { Login } from './components/Login'
import { Buttons } from './components/Buttons'
import { DSVisualizer } from './components/DSVisualizer'
import { ReactArchDiagram } from './components/ReactArchDiagram'
import { InterviewPrep } from './components/InterviewPrep'
// import { useAuthStore } from './store/authStore'
import './App.css'

type Page = 'playground' | 'ds' | 'arch' | 'interview' | 'dsa-drill'

function App() {
  // const { token, user, logout, verify } = useAuthStore()
  const [page, setPage] = useState<Page>('playground')

  // useEffect(() => { verify() }, [verify])

  // if (!token) return <Login />

  const nav = (
    <nav className="app-nav">
      <div className="app-nav-tabs">
        <button className={`app-nav-tab ${page === 'playground' ? 'active' : ''}`} onClick={() => setPage('playground')}>Playground</button>
        <button className={`app-nav-tab ${page === 'ds' ? 'active' : ''}`} onClick={() => setPage('ds')}>Data Structures</button>
        <button className={`app-nav-tab ${page === 'arch' ? 'active' : ''}`} onClick={() => setPage('arch')}>React Architecture</button>
        <button className={`app-nav-tab ${page === 'interview' ? 'active' : ''}`} onClick={() => setPage('interview')}>Interview Prep</button>
        <button className={`app-nav-tab ${page === 'dsa-drill' ? 'active' : ''}`} onClick={() => setPage('dsa-drill')}>DSA Drill 1</button>
      </div>
    </nav>
  )

  if (page === 'dsa-drill') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <div style={{ padding: '0.75rem 1.5rem', flexShrink: 0 }}>{nav}</div>
        <iframe
          src="/dsa_pattern_drill_1.html"
          style={{ flex: 1, width: '100%', border: 'none' }}
          title="DSA Pattern Drill 1"
        />
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="title-container">
        <h1 className="title">Zustand Playground</h1>
        <p className="subtitle">React state management made simple</p>
      </header>

      {nav}

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
    </div>
  )
}

export default App
