import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
// Use Vite's ?raw query parameter to import the markdown file as a string
import cheatSheetContent from '../../leetcode-interview-cheatsheet.md?raw'
import { AlgorithmWizard } from './AlgorithmWizard'

export function InterviewPrep() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <AlgorithmWizard />
      
      <div className="interview-prep-container card" style={{ overflowX: 'auto', padding: '2.5rem' }}>
        <div className="markdown-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
          components={{
            // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  {...props}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ borderRadius: '8px', padding: '1rem', background: 'rgba(0,0,0,0.3)' }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code {...props} className={className ? className + ' inline-code' : 'inline-code'}>
                  {children}
                </code>
              )
            }
          }}
        >
          {cheatSheetContent}
        </ReactMarkdown>
      </div>
      </div>
    </div>
  )
}
