import { useState, useRef, useEffect } from 'react'
import './ReactArchDiagram.css'

// ─── Types ────────────────────────────────────────────────────────────────────
interface QA { q: string; a: string }

interface NodeDef {
  id: string
  label: string
  sub: string
  layer: number
  x: number   // % of diagram width
  y: number   // % of diagram height
  connectedTo: string[]
  color: string
  apis: string[]
  description: string
  qa: QA[]
}

// ─── Layer metadata ───────────────────────────────────────────────────────────
const LAYERS = [
  { y: 7,  label: 'ENTRY',      color: '#6366f1' },
  { y: 21, label: 'ROUTING',    color: '#8b5cf6' },
  { y: 35, label: 'APP SHELL',  color: '#ec4899' },
  { y: 50, label: 'STATE',      color: '#3b82f6' },
  { y: 64, label: 'COMPONENTS', color: '#06b6d4' },
  { y: 78, label: 'DATA',       color: '#10b981' },
  { y: 92, label: 'QUALITY',    color: '#f59e0b' },
]

// ─── Node definitions ─────────────────────────────────────────────────────────
const NODES: NodeDef[] = [
  // ── Layer 0: Entry ──────────────────────────────────────────────────────────
  {
    id: 'html', label: 'index.html', sub: 'root div', layer: 0, x: 20, y: 7, color: '#6366f1',
    connectedTo: ['root'],
    apis: ['<div id="root">', 'Public assets', 'Meta tags', 'Favicon, OG tags'],
    description: 'The single HTML file that loads the entire React app. React mounts into the #root div — everything else is JavaScript.',
    qa: [
      { q: 'Why does React only need one HTML file?', a: 'React is a SPA — it controls the DOM entirely via JS. The server sends one HTML shell and React renders all UI client-side by manipulating the #root div.' },
      { q: 'What is the purpose of the public folder?', a: 'Static assets not processed by the bundler (Vite/Webpack). Files here are copied as-is and referenced by absolute paths.' },
    ],
  },
  {
    id: 'root', label: 'ReactDOM', sub: 'createRoot', layer: 0, x: 50, y: 7, color: '#6366f1',
    connectedTo: ['strict', 'router'],
    apis: ['ReactDOM.createRoot()', 'root.render()', 'hydrateRoot() (SSR)', 'ReactDOM.flushSync()'],
    description: 'Creates the React root and renders the app tree. In React 18, createRoot enables concurrent features like useTransition and Suspense.',
    qa: [
      { q: 'What changed in React 18 with createRoot?', a: 'ReactDOM.render() is legacy. createRoot() opts into concurrent mode, enabling Suspense, useTransition, useDeferredValue, and automatic batching of all state updates (not just event handlers).' },
      { q: 'What is automatic batching?', a: 'React 18 batches all state updates — even inside setTimeout, Promises, and native events — into a single re-render. Previously only updates inside React event handlers were batched.' },
    ],
  },
  {
    id: 'strict', label: 'StrictMode', sub: 'dev checks', layer: 0, x: 80, y: 7, color: '#6366f1',
    connectedTo: ['router'],
    apis: ['<React.StrictMode>', 'Double-invokes render', 'Detects legacy APIs', 'useEffect runs twice (dev)'],
    description: 'A development-only wrapper that intentionally double-invokes renders and effects to surface bugs from side effects and impure renders.',
    qa: [
      { q: 'Why does useEffect run twice in development?', a: 'StrictMode intentionally mounts → unmounts → remounts components to verify effects have proper cleanup. This catches effects that subscribe without unsubscribing, revealing resource leaks.' },
      { q: 'Does StrictMode affect production?', a: 'No — it is stripped completely. Zero performance or behavior impact in production builds.' },
    ],
  },

  // ── Layer 1: Routing ────────────────────────────────────────────────────────
  {
    id: 'router', label: 'React Router', sub: 'v6 / TanStack Router', layer: 1, x: 35, y: 21, color: '#8b5cf6',
    connectedTo: ['protected', 'app'],
    apis: ['<BrowserRouter>', '<Routes> / <Route>', 'useNavigate()', 'useParams()', 'useSearchParams()', 'useLocation()', '<Outlet>', '<Link>/<NavLink>'],
    description: 'Client-side routing library. v6 rewrote the API with nested routes, relative links, and index routes. TanStack Router adds type-safe params.',
    qa: [
      { q: 'How do nested routes work in React Router v6?', a: '<Outlet> renders child routes inside a parent layout. The parent route renders its component (with <Outlet>) and the matched child route renders inside it — perfect for shared layouts.' },
      { q: 'useNavigate vs. history.push — what changed?', a: 'useNavigate() is the v6 hook. It returns a function: navigate(\'/path\') or navigate(-1) to go back. It replaces useHistory() from v5. navigate(path, { replace: true }) replaces history entry.' },
      { q: 'How do you pass data between routes without URL params?', a: 'Use navigate(\'/path\', { state: { data } }) and retrieve with useLocation().state. Or lift state up / use global state (Redux, Zustand, Context).' },
    ],
  },
  {
    id: 'protected', label: 'Protected Routes', sub: 'auth guard', layer: 1, x: 70, y: 21, color: '#8b5cf6',
    connectedTo: ['app'],
    apis: ['<Navigate replace />', 'useAuth() hook', 'Outlet pattern', 'Role-based rendering'],
    description: 'A wrapper component that checks authentication state and either renders the route or redirects. Built with the Outlet pattern in v6.',
    qa: [
      { q: 'How do you implement protected routes in React Router v6?', a: 'Create a ProtectedRoute component that reads auth state. If authenticated, return <Outlet /> to render child routes. Otherwise return <Navigate to="/login" replace />. Wrap private routes with <Route element={<ProtectedRoute />}>.' },
      { q: 'How do you handle role-based access control?', a: 'Extend ProtectedRoute to accept a requiredRole prop. Check user.role against it. Redirect unauthorized users to a /403 page or back to home.' },
    ],
  },

  // ── Layer 2: App Shell ──────────────────────────────────────────────────────
  {
    id: 'app', label: 'App Component', sub: 'root tree', layer: 2, x: 22, y: 35, color: '#ec4899',
    connectedTo: ['providers', 'boundary'],
    apis: ['JSX composition', 'Layout components', 'Suspense boundaries', 'Global styles'],
    description: 'The root component that assembles the provider tree, global layout, and route outlets. Keeps global setup separate from business logic.',
    qa: [
      { q: 'What should go in the App component?', a: 'Provider wrappers, top-level error boundaries, Suspense fallbacks, and the router. Business logic and data fetching belong in feature components, not App.' },
    ],
  },
  {
    id: 'providers', label: 'Providers', sub: 'Context / Store', layer: 2, x: 52, y: 35, color: '#ec4899',
    connectedTo: ['redux', 'context', 'hooks'],
    apis: ['<Provider store={store}>', '<QueryClientProvider>', '<ThemeContext.Provider>', 'Nesting order matters'],
    description: 'The provider tree wraps the entire app to make global state, theme, and services available anywhere via hooks — without prop drilling.',
    qa: [
      { q: 'Does the order of providers matter?', a: 'Yes. Inner providers can consume outer ones. QueryClientProvider must wrap components using React Query hooks. Store Provider must wrap useSelector/useDispatch consumers. Put rarely-changing providers (theme, auth) outermost.' },
    ],
  },
  {
    id: 'boundary', label: 'Error Boundary', sub: 'class component', layer: 2, x: 82, y: 35, color: '#ec4899',
    connectedTo: ['perf'],
    apis: ['componentDidCatch()', 'getDerivedStateFromError()', 'react-error-boundary lib', 'fallback UI', 'onReset callback'],
    description: 'Catches JavaScript errors in child component trees and renders a fallback UI instead of crashing the whole app. Must be a class component.',
    qa: [
      { q: 'Why can\'t error boundaries be functional components?', a: 'Error boundaries require componentDidCatch and getDerivedStateFromError lifecycle methods, which have no functional equivalent hooks yet. Use the react-error-boundary library for a cleaner API.' },
      { q: 'What errors do Error Boundaries NOT catch?', a: 'Async errors (setTimeout, Promises), event handlers, server-side rendering errors, and errors in the boundary itself. Use try/catch or window.onerror for those.' },
    ],
  },

  // ── Layer 3: State ──────────────────────────────────────────────────────────
  {
    id: 'redux', label: 'Redux Toolkit', sub: 'global state', layer: 3, x: 13, y: 50, color: '#3b82f6',
    connectedTo: ['rtk', 'hooks'],
    apis: ['configureStore()', 'createSlice()', 'createAsyncThunk()', 'useSelector()', 'useDispatch()', 'Immer (built-in)', 'Redux DevTools'],
    description: 'The official, opinionated Redux toolset. createSlice generates action creators + reducers from one object. Immer lets you write "mutating" code that\'s actually immutable.',
    qa: [
      { q: 'What problem does createSlice solve?', a: 'In vanilla Redux you write action type constants, action creators, and a reducer separately — lots of boilerplate. createSlice combines all three: define reducers as methods, it auto-generates action creators and the action type strings.' },
      { q: 'How does Immer work inside reducers?', a: 'RTK wraps reducers with Immer. You can write state.value = action.payload directly. Immer tracks mutations on a proxy draft and produces a new immutable object — you never mutate the real state.' },
      { q: 'When would you choose Redux over Zustand?', a: 'Redux for large teams needing strict conventions, time-travel debugging, and middleware ecosystem. Zustand for smaller apps wanting minimal boilerplate. RTK closes the gap significantly.' },
    ],
  },
  {
    id: 'rtk', label: 'RTK Query', sub: 'server state', layer: 3, x: 38, y: 50, color: '#3b82f6',
    connectedTo: ['api', 'rquery'],
    apis: ['createApi()', 'fetchBaseQuery()', 'useGetXQuery()', 'useMutateXMutation()', 'invalidatesTags', 'providesTags', 'optimistic updates'],
    description: 'RTK Query is a powerful data fetching and caching solution built into Redux Toolkit. Auto-generates hooks for each endpoint, handles loading/error states, and cache invalidation.',
    qa: [
      { q: 'How does RTK Query handle cache invalidation?', a: 'Endpoints declare providesTags (what data they supply) and mutations declare invalidatesTags (what they invalidate). When a mutation runs, RTK Query refetches all queries that provide those tags.' },
      { q: 'RTK Query vs React Query — which do you pick?', a: 'RTK Query if you\'re already using Redux — it integrates with the store. React Query if you want a lighter, stand-alone solution without Redux. React Query has more flexibility (infinite scroll, dependent queries).' },
    ],
  },
  {
    id: 'zustand', label: 'Zustand', sub: 'lightweight state', layer: 3, x: 62, y: 50, color: '#3b82f6',
    connectedTo: ['hooks'],
    apis: ['create()', 'useStore(selector)', 'set(), get()', 'persist middleware', 'immer middleware', 'devtools middleware'],
    description: 'Minimal global state manager. A store is just a hook. No providers, no reducers, no action creators. Select state slices to prevent unnecessary re-renders.',
    qa: [
      { q: 'How does Zustand prevent unnecessary re-renders?', a: 'useStore accepts a selector: const count = useStore(s => s.count). The component only re-renders when the selected value changes — not on every store update. Use shallow() for object selectors.' },
      { q: 'How do you persist Zustand state?', a: 'Wrap the store creator with persist middleware: create(persist((set) => ({...}), { name: \'my-store\' })). It serializes to localStorage by default. Customize with storage option.' },
    ],
  },
  {
    id: 'context', label: 'Context API', sub: 'React built-in', layer: 3, x: 87, y: 50, color: '#3b82f6',
    connectedTo: ['hooks'],
    apis: ['createContext()', 'useContext()', '<Context.Provider>', 'Context.Consumer', 'useMemo for value', 'Context splitting'],
    description: 'Built-in React mechanism to share state without prop drilling. Great for low-frequency updates (theme, locale, auth). Not optimized for high-frequency updates.',
    qa: [
      { q: 'When should you use Context instead of Redux?', a: 'Context is ideal for global, low-frequency data: theme, language, authenticated user, feature flags. For complex state with many updates (shopping cart, form state), Redux/Zustand is better — Context re-renders all consumers on every change.' },
      { q: 'How do you optimize Context to prevent re-renders?', a: 'Split context by concern (don\'t put everything in one context). Memoize the value object with useMemo. Split into state context + dispatch context so components that only dispatch don\'t re-render on state changes.' },
    ],
  },

  // ── Layer 4: Components ─────────────────────────────────────────────────────
  {
    id: 'hooks', label: 'React Hooks', sub: 'built-in + React 18', layer: 4, x: 20, y: 64, color: '#06b6d4',
    connectedTo: ['custom', 'patterns'],
    apis: ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'useReducer', 'useLayoutEffect', 'useId', 'useTransition', 'useDeferredValue', 'useOptimistic (19)'],
    description: 'Functions that let you use React state and lifecycle features inside functional components. Each hook has a specific purpose — picking the right one is key.',
    qa: [
      { q: 'useMemo vs useCallback — what\'s the difference?', a: 'useMemo memoizes a computed value: const val = useMemo(() => heavyCalc(a, b), [a, b]). useCallback memoizes a function reference: const fn = useCallback(() => doThing(x), [x]). Use useCallback to stabilize function props passed to memo() components.' },
      { q: 'When would you use useReducer over useState?', a: 'useReducer is better when: (1) next state depends on previous state, (2) state has multiple sub-values that update together, (3) state transition logic is complex. It collocates update logic and makes it testable in isolation.' },
      { q: 'What is useTransition?', a: 'Marks a state update as non-urgent. React can interrupt it to handle urgent updates (like typing). const [isPending, startTransition] = useTransition(). Wrap slow updates in startTransition(() => setState(...)). isPending shows a loading indicator.' },
      { q: 'useEffect vs useLayoutEffect?', a: 'useEffect fires asynchronously after paint — safe for most side effects (data fetch, subscriptions). useLayoutEffect fires synchronously before paint — use only for DOM measurements/mutations that must happen before the user sees the render (prevents flash).' },
    ],
  },
  {
    id: 'custom', label: 'Custom Hooks', sub: 'reusable logic', layer: 4, x: 50, y: 64, color: '#06b6d4',
    connectedTo: ['api', 'rquery'],
    apis: ['useAuth()', 'useFetch()', 'useDebounce()', 'useLocalStorage()', 'useOnClickOutside()', 'useIntersectionObserver()', 'useWindowSize()'],
    description: 'Functions starting with "use" that encapsulate and reuse stateful logic across components. They can call other hooks and return any value.',
    qa: [
      { q: 'What makes a good custom hook?', a: 'Single responsibility: one concern per hook. Returns values/callbacks the component needs. Doesn\'t return JSX (that\'s a component). Encapsulates the "how" so components only deal with the "what". Example: useFetch abstracts fetch + loading + error state.' },
      { q: 'How do you implement useDebounce?', a: 'function useDebounce<T>(value: T, delay: number) { const [debounced, set] = useState(value); useEffect(() => { const t = setTimeout(() => set(value), delay); return () => clearTimeout(t); }, [value, delay]); return debounced; }' },
    ],
  },
  {
    id: 'patterns', label: 'Component Patterns', sub: 'design patterns', layer: 4, x: 80, y: 64, color: '#06b6d4',
    connectedTo: ['perf', 'testing'],
    apis: ['React.memo()', 'Compound Components', 'Render Props', 'HOC pattern', 'Controlled vs Uncontrolled', 'Lifting state up', 'Slot pattern (children)'],
    description: 'Proven patterns for structuring components and sharing logic. Modern React favors hooks over HOC/render props, but compound components and slots remain powerful.',
    qa: [
      { q: 'When do you use React.memo()?', a: 'When a component re-renders with the same props and the render is expensive. Wrap with React.memo() to skip re-renders if props haven\'t changed. Combine with useCallback for function props. Don\'t use it prematurely — profiling first.' },
      { q: 'What is the compound component pattern?', a: 'A parent component shares state with children via Context. Children are attached as properties: <Select><Select.Option /><Select.Option /></Select>. Gives consumers flexible composition while hiding internal state management.' },
      { q: 'Controlled vs Uncontrolled components?', a: 'Controlled: React owns the value via state + onChange. You control every keystroke. Uncontrolled: DOM owns the value; you read it with a ref. Use controlled for validation, formatting, conditional logic. Uncontrolled for simple forms or file inputs.' },
    ],
  },

  // ── Layer 5: Data ───────────────────────────────────────────────────────────
  {
    id: 'api', label: 'API Layer', sub: 'Axios / Fetch', layer: 5, x: 32, y: 78, color: '#10b981',
    connectedTo: ['perf'],
    apis: ['axios.create(baseURL)', 'Interceptors (req/res)', 'Token refresh logic', 'AbortController', 'fetch + signal', 'Error normalization'],
    description: 'The HTTP abstraction layer. Axios instances with interceptors handle auth headers, token refresh on 401, and error normalization uniformly.',
    qa: [
      { q: 'How do you implement automatic token refresh?', a: 'In an Axios response interceptor: catch 401 errors, call the refresh endpoint, update the stored token, and retry the original request. Use a queue to handle multiple concurrent 401s without multiple refresh calls.' },
      { q: 'How do you cancel API requests when a component unmounts?', a: 'Create an AbortController, pass signal to fetch or axios config. In useEffect\'s cleanup: controller.abort(). This prevents setState-on-unmounted-component warnings and avoids race conditions.' },
    ],
  },
  {
    id: 'rquery', label: 'React Query', sub: 'TanStack Query', layer: 5, x: 68, y: 78, color: '#10b981',
    connectedTo: ['perf'],
    apis: ['useQuery()', 'useMutation()', 'useInfiniteQuery()', 'QueryClient', 'staleTime / gcTime', 'queryKey arrays', 'Optimistic updates', 'Prefetching'],
    description: 'The gold standard for async server-state management. Handles caching, background refetching, deduplication, and synchronization between tabs.',
    qa: [
      { q: 'What is staleTime vs gcTime (cacheTime)?', a: 'staleTime: how long data is considered fresh — no background refetch during this period. gcTime (formerly cacheTime): how long inactive query data stays in cache before being garbage collected. staleTime=Infinity means never refetch automatically.' },
      { q: 'How do you implement optimistic updates with React Query?', a: 'In useMutation\'s onMutate: cancel the query, snapshot old data, manually set new cache data. In onError: rollback to snapshot. In onSettled: invalidate the query to refetch real data. This makes UI feel instant.' },
      { q: 'What is the query key and why does it matter?', a: 'The query key uniquely identifies cached data. ["todos"] fetches all todos. ["todos", id] fetches one. ["todos", { status: "active" }] adds filters. React Query refetches when keys change — dependency array for server state.' },
    ],
  },

  // ── Layer 6: Quality ────────────────────────────────────────────────────────
  {
    id: 'perf', label: 'Performance', sub: 'optimization', layer: 6, x: 20, y: 92, color: '#f59e0b',
    connectedTo: [],
    apis: ['React.lazy()', 'Suspense', 'Dynamic import()', 'react-window (virtualization)', 'React DevTools Profiler', 'Web Vitals (LCP, FID, CLS)', 'Concurrent features'],
    description: 'Performance is measured first, then optimized. Code splitting reduces initial bundle, virtualization handles large lists, memoization prevents wasted renders.',
    qa: [
      { q: 'How does React.lazy() and Suspense work?', a: 'React.lazy(() => import(\'./Component\')) creates a lazy-loaded component. Suspense provides a fallback while it loads. The dynamic import() splits the chunk at build time. Routes are the most common split point.' },
      { q: 'How do you profile a React app?', a: 'React DevTools Profiler tab: record interactions, see which components rendered and why, flame chart shows render duration. Lighthouse for Web Vitals. React 18 concurrent profiling shows render priority.' },
      { q: 'When does virtualization help?', a: 'Lists with 100+ items. Instead of rendering all DOM nodes, react-window/react-virtual renders only visible rows + a small overscan. The DOM size stays constant regardless of data size — critical for tables and infinite feeds.' },
    ],
  },
  {
    id: 'testing', label: 'Testing', sub: 'RTL / Vitest / Playwright', layer: 6, x: 50, y: 92, color: '#f59e0b',
    connectedTo: [],
    apis: ['@testing-library/react', 'render(), screen.*', 'userEvent', 'vi.mock() (Vitest)', 'MSW (Mock Service Worker)', 'Playwright E2E', 'jest.fn() / spyOn'],
    description: 'Test behavior, not implementation. RTL queries by accessibility role/text like a user would. MSW intercepts network at the service worker level for realistic API mocking.',
    qa: [
      { q: 'What is the Testing Library philosophy?', a: '"The more your tests resemble the way your software is used, the more confidence they give you." Query by role, text, label — not class names or test IDs. Avoid testing internal state; test observable behavior.' },
      { q: 'How does MSW (Mock Service Worker) work?', a: 'MSW registers a service worker that intercepts real fetch/XHR calls at the browser network level. Your app code runs unchanged — no mocking of fetch or axios. Define handlers: rest.get(\'/api/users\', (req, res, ctx) => res(ctx.json([...]))). Works in browser and Node tests.' },
      { q: 'What is the difference between getBy, queryBy, and findBy?', a: 'getBy: throws if not found (synchronous). queryBy: returns null if not found — use for asserting absence. findBy: returns a promise, waits for element to appear — use for async UI updates after events or data loading.' },
    ],
  },
  {
    id: 'typescript', label: 'TypeScript', sub: 'type safety', layer: 6, x: 80, y: 92, color: '#f59e0b',
    connectedTo: [],
    apis: ['FC<Props>', 'React.ReactNode', 'useRef<HTMLDivElement>', 'ComponentProps<T>', 'Discriminated unions', 'Generic components', 'satisfies operator'],
    description: 'TypeScript with React catches prop type mismatches, missing required fields, and invalid hook arguments at compile time — not in production.',
    qa: [
      { q: 'How do you type a component that accepts children?', a: 'Use React.PropsWithChildren<Props> or add children?: React.ReactNode to your Props interface. ReactNode covers strings, numbers, elements, arrays, null. ReactElement is only JSX elements.' },
      { q: 'How do you type useRef?', a: 'For DOM refs: useRef<HTMLDivElement>(null) — the type matches the element. For mutable values (not DOM): useRef<number>(0). TypeScript enforces that you null-check DOM refs before accessing .current.' },
      { q: 'What are discriminated unions useful for in React?', a: 'Modeling component states: type State = { status: "loading" } | { status: "error"; error: string } | { status: "success"; data: User[] }. TypeScript narrows the type in each branch — you can\'t access data when status is "error".' },
    ],
  },
]

const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]))

// ─── Edge list ────────────────────────────────────────────────────────────────
const EDGES = NODES.flatMap(n => n.connectedTo.map(to => ({ from: n.id, to })))

// ─── Main component ───────────────────────────────────────────────────────────
export function ReactArchDiagram() {
  const [selected, setSelected] = useState<NodeDef | null>(null)
  const [tab, setTab] = useState<'details' | 'qa'>('details')
  const [query, setQuery] = useState('')
  const [hovered, setHovered] = useState<string | null>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const [dims, setDims] = useState({ w: 860, h: 580 })

  useEffect(() => {
    const el = diagramRef.current
    if (!el) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDims({ w: width, h: height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const matched = query.trim()
    ? NODES.filter(n =>
        n.label.toLowerCase().includes(query.toLowerCase()) ||
        n.apis.some(a => a.toLowerCase().includes(query.toLowerCase()))
      ).map(n => n.id)
    : null

  const isHighlighted = (id: string) =>
    matched ? matched.includes(id) : hovered
      ? id === hovered || (NODE_MAP[hovered]?.connectedTo.includes(id)) || (NODES.find(n => n.id === hovered && n.connectedTo.includes(id))) !== undefined
      : true

  const isEdgeHighlighted = (from: string, to: string) =>
    matched
      ? matched.includes(from) && matched.includes(to)
      : hovered ? (from === hovered || to === hovered) : true

  const px = (xPct: number) => (xPct / 100) * dims.w
  const py = (yPct: number) => (yPct / 100) * dims.h

  const select = (node: NodeDef) => {
    setSelected(node)
    setTab('details')
  }

  return (
    <div className="rad-root">
      {/* ── Search ── */}
      <div className="rad-toolbar">
        <input
          className="rad-search"
          placeholder="Search nodes or APIs…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <span className="rad-hint">Click any node for details + Interview Q&amp;A</span>
      </div>

      <div className="rad-body">
        {/* ── Diagram ── */}
        <div className="rad-diagram" ref={diagramRef}>

          {/* Layer labels */}
          {LAYERS.map(l => (
            <div
              key={l.label}
              className="rad-layer-label"
              style={{ top: `calc(${l.y}% - 10px)`, borderColor: l.color, color: l.color }}
            >
              {l.label}
            </div>
          ))}

          {/* SVG edges */}
          <svg className="rad-svg" viewBox={`0 0 ${dims.w} ${dims.h}`}>
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L0,6 L6,3 Z" fill="rgba(148,163,184,0.4)" />
              </marker>
            </defs>
            {EDGES.map(({ from, to }) => {
              const a = NODE_MAP[from], b = NODE_MAP[to]
              if (!a || !b) return null
              const x1 = px(a.x), y1 = py(a.y)
              const x2 = px(b.x), y2 = py(b.y)
              const cy1 = y1 + (y2 - y1) * 0.45
              const cy2 = y2 - (y2 - y1) * 0.45
              const lit = isEdgeHighlighted(from, to)
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M${x1},${y1} C${x1},${cy1} ${x2},${cy2} ${x2},${y2}`}
                  fill="none"
                  stroke={lit ? a.color : 'rgba(255,255,255,0.06)'}
                  strokeWidth={lit ? 1.5 : 1}
                  strokeDasharray={lit ? undefined : '4 4'}
                  opacity={lit ? 0.7 : 0.4}
                  markerEnd="url(#arrow)"
                />
              )
            })}
          </svg>

          {/* Nodes */}
          {NODES.map(node => {
            const lit = isHighlighted(node.id)
            const isSel = selected?.id === node.id
            const isHov = hovered === node.id
            return (
              <div
                key={node.id}
                className={`rad-node ${isSel ? 'rad-node-selected' : ''} ${!lit ? 'rad-node-dim' : ''}`}
                style={{
                  left: `${node.x}%`,
                  top:  `${node.y}%`,
                  borderColor: (isSel || isHov) ? node.color : `${node.color}55`,
                  boxShadow: isSel ? `0 0 16px ${node.color}66` : isHov ? `0 0 10px ${node.color}44` : 'none',
                }}
                onClick={() => select(node)}
                onMouseEnter={() => { setHovered(node.id); setQuery('') }}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="rad-node-dot" style={{ background: node.color }} />
                <span className="rad-node-label">{node.label}</span>
                <span className="rad-node-sub">{node.sub}</span>
              </div>
            )
          })}
        </div>

        {/* ── Detail Panel ── */}
        <div className={`rad-panel ${selected ? 'rad-panel-open' : ''}`}>
          {selected ? (
            <>
              <div className="rad-panel-header" style={{ borderColor: selected.color }}>
                <div>
                  <div className="rad-panel-dot" style={{ background: selected.color }} />
                  <h3 className="rad-panel-title">{selected.label}</h3>
                  <p className="rad-panel-sub">{selected.sub}</p>
                </div>
                <button className="rad-close" onClick={() => setSelected(null)}>✕</button>
              </div>

              <div className="rad-panel-tabs">
                <button className={`rad-ptab ${tab === 'details' ? 'active' : ''}`} onClick={() => setTab('details')}>Details</button>
                <button className={`rad-ptab ${tab === 'qa' ? 'active' : ''}`} onClick={() => setTab('qa')}>Interview Q&amp;A</button>
              </div>

              <div className="rad-panel-body">
                {tab === 'details' && (
                  <>
                    <p className="rad-desc">{selected.description}</p>
                    <h4 className="rad-section-title">Key APIs &amp; Concepts</h4>
                    <ul className="rad-apis">
                      {selected.apis.map(a => <li key={a}><code>{a}</code></li>)}
                    </ul>
                    {selected.connectedTo.length > 0 && (
                      <>
                        <h4 className="rad-section-title">Connected To</h4>
                        <div className="rad-connected">
                          {selected.connectedTo.map(id => (
                            <button
                              key={id}
                              className="rad-conn-chip"
                              style={{ borderColor: NODE_MAP[id]?.color, color: NODE_MAP[id]?.color }}
                              onClick={() => select(NODE_MAP[id])}
                            >
                              {NODE_MAP[id]?.label}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {tab === 'qa' && (
                  <div className="rad-qa-list">
                    {selected.qa.map((item, i) => (
                      <div key={i} className="rad-qa-item">
                        <div className="rad-q">Q: {item.q}</div>
                        <div className="rad-a">{item.a}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="rad-panel-empty">
              <span>←</span>
              <p>Click any node to explore</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
