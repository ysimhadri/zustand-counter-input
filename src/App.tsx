import { Counter } from './components/Counter'
import { Input } from './components/Input'
import { HomeDirectoryFiles } from './components/HomeDirectoryFiles'
import './App.css'
import { Buttons } from './components/Buttons'

function App() {
  return (
    <div className="app-container">
      <header className="title-container">
        <h1 className="title">Zustand Playground</h1>
        <p className="subtitle">React state management made simple</p>
      </header>

      <main className="main-layout">
        <div className="left-column">
          <Counter />
          <Input />
        </div>
        <div className="right-column" style={{ flexDirection: 'row', alignItems: 'start', gap: '2rem' }}>
          <HomeDirectoryFiles />
          <Buttons/>
        </div>
      </main>
    </div>
  )
}

export default App
