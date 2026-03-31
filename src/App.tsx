import { useEffect } from 'react'
import { Counter } from './components/Counter'
import { Input } from './components/Input'
import { HomeDirectoryFiles } from './components/HomeDirectoryFiles'
import { Login } from './components/Login'
import { Buttons } from './components/Buttons'
import { useAuthStore } from './store/authStore'
import './App.css'

function App() {
  const { token, user, logout, verify } = useAuthStore()

  // On mount, validate any stored token
  useEffect(() => {
    verify()
  }, [verify])

  if (!token) return <Login />

  return (
    <div className="app-container">
      <header className="title-container">
        <h1 className="title">Zustand Playground</h1>
        <p className="subtitle">React state management made simple</p>
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Signed in as <strong style={{ color: 'var(--text-primary)' }}>{user?.name ?? '...'}</strong>
            {user?.role && <span style={{ marginLeft: '0.4rem', fontSize: '0.75rem', background: 'rgba(96,165,250,0.15)', color: '#60a5fa', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>{user.role}</span>}
          </span>
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }} onClick={logout}>
            Sign Out
          </button>
        </div>
      </header>

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
    </div>
  )
}

export default App
