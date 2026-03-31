import { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import './HomeDirectoryFiles.css';

interface FileItem {
  name: string;
  isDirectory: boolean;
  path: string;
}

const getLanguageFromFilename = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'html': return 'html';
    case 'css': return 'css';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'py': return 'python';
    case 'sh': return 'shell';
    case 'yml':
    case 'yaml':
      return 'yaml';
    case 'xml': return 'xml';
    default: return 'plaintext';
  }
};

export function HomeDirectoryFiles() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [homeDir, setHomeDir] = useState<string>('');
  const [currentPath, setCurrentPath] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  // Editor states
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const fetchFiles = useCallback(async (dirPath?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = dirPath ? `/api/home-files?dir=${encodeURIComponent(dirPath)}` : '/api/home-files';
      const res = await fetch(url);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch directory contents');
      
      setFiles(data.files);
      setHomeDir(data.homeDir);
      setCurrentPath(data.currentPath);
    } catch (err: unknown) {
      console.error('Error fetching files:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFolderClick = (path: string) => {
    setFilter('');
    fetchFiles(path);
  };

  const handleGoBack = () => {
    if (currentPath && currentPath !== homeDir) {
      const parts = currentPath.split('/');
      parts.pop();
      const parentDir = parts.join('/') || '/';
      fetchFiles(parentDir);
    }
  };

  const handleDelete = async (filePath: string, fileName: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${fileName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/home-files?path=${encodeURIComponent(filePath)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to delete file');
      
      fetchFiles(currentPath);
    } catch (err: unknown) {
      console.error('Error deleting file:', err);
      alert(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const handleFileClick = async (file: FileItem) => {
    setLoading(true);
    setError(null);
    setSaveSuccess(false);
    
    try {
      const res = await fetch(`/api/home-files/content?path=${encodeURIComponent(file.path)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to read file content');
      
      setFileContent(data.content);
      setEditingFile(file);
    } catch (err: unknown) {
      console.error('Error reading file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFile = async () => {
    if (!editingFile) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    setError(null);
    
    try {
      const res = await fetch(`/api/home-files/content?path=${encodeURIComponent(editingFile.path)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: fileContent })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to save file');
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: unknown) {
      console.error('Error saving file:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSaving(false);
    }
  };

  const closeEditor = () => {
    setEditingFile(null);
    setFileContent('');
    setError(null);
    setSaveSuccess(false);
    setIsExpanded(false);
  };

  // ----------------- RENDER EDITOR MODE -----------------
  if (editingFile) {
    return (
      <div className={`card home-files-container editor-mode ${isExpanded ? 'editor-expanded' : ''}`}>
        <div className="card-header" style={{ marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '200px' }}>
            <button className="btn btn-secondary back-btn" onClick={closeEditor} title="Close Editor">
              ⬅️
            </button>
            <span style={{ fontSize: '1rem', wordBreak: 'break-all', opacity: 0.9 }}>
              Editing: <strong style={{ fontWeight: 600 }}>{editingFile.name}</strong>
            </span>
          </h2>
          <div className="editor-actions">
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse View" : "Expand to Fullscreen"}
              style={{ padding: '0.5rem 1rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center' }}
            >
              {isExpanded ? '⮽' : '⛶'}
            </button>
            <button 
              className={`btn ${saveSuccess ? 'btn-success' : 'btn-primary'}`}
              onClick={handleSaveFile}
              disabled={isSaving}
              style={{ padding: '0.5rem 1rem' }}
            >
              {isSaving ? 'Saving...' : saveSuccess ? 'Saved ✅' : 'Save (💾)'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="error-banner">
            <p>{error}</p>
          </div>
        )}
        
        <div className="monaco-wrapper">
          <Editor
            height="100%"
            language={getLanguageFromFilename(editingFile.name)}
            theme="vs-dark"
            value={fileContent}
            onChange={(val) => setFileContent(val || '')}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              readOnly: isSaving,
              fontSize: 14,
              fontFamily: 'ui-monospace, Consolas, "Liberation Mono", Menlo, Courier, monospace',
              padding: { top: 16 }
            }}
            loading={<div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading Editor...</div>}
          />
        </div>
      </div>
    );
  }

  // ----------------- RENDER BROWSER MODE -----------------
  
  if (loading && !files.length) {
    return (
      <div className="card home-files-container">
        <div className="card-header">
          <h2>Home Directory</h2>
          <span className="badge">Loading...</span>
        </div>
      </div>
    );
  }

  const relativePath = currentPath === homeDir ? '~' : '~' + currentPath.replace(homeDir, '');

  return (
    <div className="card home-files-container">
      <div className="card-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {currentPath !== homeDir && (
            <button className="btn btn-secondary back-btn" onClick={handleGoBack} title="Go Back">
              ⬅️
            </button>
          )}
          <span>Directory Viewer</span>
        </h2>
        <input
          type="text"
          placeholder="Filter files..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid var(--border-color)',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            width: '180px',
          }}
        />
        <span className="badge">{files.filter(f => f.name.toLowerCase().includes(filter.toLowerCase())).length} items</span>
      </div>
      
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }} onClick={() => fetchFiles(homeDir)}>
            Reset to ~
          </button>
        </div>
      )}
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>
        <span style={{ fontFamily: 'monospace' }}>{relativePath}</span>
        {loading && <span style={{ marginLeft: '0.5rem', opacity: 0.5 }}>(Refreshing...)</span>}
      </p>
      
      <div className="files-list">
        {files.filter(f => f.name.toLowerCase().includes(filter.toLowerCase())).sort((a, b) => {
          if (a.isDirectory === b.isDirectory) return a.name.localeCompare(b.name);
          return a.isDirectory ? -1 : 1;
        }).map(file => (
          <div 
            key={file.path} 
            className="file-item clickable"
            onClick={() => file.isDirectory ? handleFolderClick(file.path) : handleFileClick(file)}
          >
            <div className="file-info">
              <span className="icon">{file.isDirectory ? '📁' : '📄'}</span>
              <span className="name" title={file.name}>{file.name}</span>
            </div>
            
            {!file.isDirectory && (
              <button 
                className="delete-btn" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(file.path, file.name);
                }}
                title="Delete File"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
