import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import url from 'node:url'
import crypto from 'node:crypto'

// ─── Mock JWT helpers ────────────────────────────────────────────────────────
const JWT_SECRET = 'mock-secret-do-not-use-in-production'

const MOCK_USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User' },
  { id: 2, username: 'user',  password: 'user123',  role: 'user',  name: 'Regular User' },
]

function b64url(str: string) {
  return Buffer.from(str).toString('base64url')
}

function signJWT(payload: object) {
  const header  = b64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body    = b64url(JSON.stringify(payload))
  const sig     = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${sig}`
}

function verifyJWT(token: string) {
  const [header, body, sig] = token.split('.')
  if (!header || !body || !sig) throw new Error('Malformed token')
  const expected = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url')
  if (sig !== expected) throw new Error('Invalid signature')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  if (payload.exp < Math.floor(Date.now() / 1000)) throw new Error('Token expired')
  return payload
}

function readBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk: Buffer) => { raw += chunk.toString() })
    req.on('end', () => { try { resolve(JSON.parse(raw)) } catch { reject(new Error('Invalid JSON')) } })
    req.on('error', reject)
  })
}
// ─────────────────────────────────────────────────────────────────────────────

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'home-dir-api',
      configureServer(server) {

        // ── POST /api/auth/login ──────────────────────────────────────────────
        server.middlewares.use('/api/auth/login', async (req, res, next) => {
          if (req.method !== 'POST') return next()
          res.setHeader('Content-Type', 'application/json')
          try {
            const { username, password } = await readBody(req)
            const found = MOCK_USERS.find(u => u.username === username && u.password === password)
            if (!found) {
              res.statusCode = 401
              res.end(JSON.stringify({ error: 'Invalid username or password' }))
              return
            }
            const now = Math.floor(Date.now() / 1000)
            const token = signJWT({ sub: found.id, name: found.name, role: found.role, iat: now, exp: now + 3600 })
            res.end(JSON.stringify({ token, user: { id: found.id, name: found.name, role: found.role, username: found.username } }))
          } catch (err: unknown) {
            res.statusCode = 400
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Bad request' }))
          }
        })

        // ── GET /api/auth/me ──────────────────────────────────────────────────
        server.middlewares.use('/api/auth/me', (req, res, next) => {
          if (req.method !== 'GET') return next()
          res.setHeader('Content-Type', 'application/json')
          try {
            const auth = (req as any).headers['authorization'] || ''
            const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''
            if (!token) { res.statusCode = 401; res.end(JSON.stringify({ error: 'No token' })); return }
            const payload = verifyJWT(token)
            res.end(JSON.stringify({ user: { id: payload.sub, name: payload.name, role: payload.role } }))
          } catch (err: unknown) {
            res.statusCode = 401
            res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Unauthorized' }))
          }
        })

        // Content API for reading and writing files
        server.middlewares.use('/api/home-files/content', (req, res) => {
          try {
            const homeDir = os.homedir();
            const queryObject = url.parse(req.url || '', true).query;
            const targetPath = typeof queryObject.path === 'string' ? queryObject.path : null;

            if (!targetPath) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Path parameter is required' }));
              return;
            }

            const resolvedTargetPath = path.resolve(targetPath);
            if (!resolvedTargetPath.startsWith(homeDir)) {
              res.statusCode = 403;
              res.end(JSON.stringify({ error: 'Access denied: Cannot access outside of home directory' }));
              return;
            }

            if (req.method === 'GET') {
              const content = fs.readFileSync(resolvedTargetPath, 'utf-8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ content }));
              return;
            } else if (req.method === 'PUT') {
              let body = '';
              req.on('data', chunk => {
                body += chunk.toString();
                if (body.length > 5 * 1024 * 1024) { 
                  res.statusCode = 413;
                  res.end(JSON.stringify({ error: 'Payload too large' }));
                  req.socket.destroy();
                }
              });
              req.on('end', () => {
                try {
                  const parsedBody = JSON.parse(body);
                  if (typeof parsedBody.content !== 'string') {
                    throw new Error('Content must be a string');
                  }
                  fs.writeFileSync(resolvedTargetPath, parsedBody.content, 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: true }));
                } catch (err: unknown) {
                  res.statusCode = 400;
                  res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Invalid request body' }));
                }
              });
              return;
            } else {
              res.statusCode = 405;
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }
          } catch (error: unknown) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process request' }));
          }
        });

        // Directory Listing API
        server.middlewares.use('/api/home-files', (req, res) => {
          try {
            const homeDir = os.homedir();
            
            // Parse query parameters from the request URL
            const queryObject = url.parse(req.url || '', true).query;
            const targetDir = typeof queryObject.dir === 'string' ? queryObject.dir : homeDir;
            
            // Prevent path traversal outside the user's home directory
            const resolvedTargetDir = path.resolve(targetDir);
            if (!resolvedTargetDir.startsWith(homeDir)) {
              res.statusCode = 403;
              res.end(JSON.stringify({ error: 'Access denied: Cannot navigate outside of home directory' }));
              return;
            }

            // DELETE Request: Delete a specific file permanently
            if (req.method === 'DELETE') {
              const targetPath = typeof queryObject.path === 'string' ? queryObject.path : null;
              
              if (!targetPath) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Path parameter is required for deletion' }));
                return;
              }
              
              const resolvedTargetPath = path.resolve(targetPath);
              if (!resolvedTargetPath.startsWith(homeDir)) {
                res.statusCode = 403;
                res.end(JSON.stringify({ error: 'Access denied: Cannot delete outside of home directory' }));
                return;
              }

              const stats = fs.statSync(resolvedTargetPath);
              if (!stats.isFile()) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Only files can be deleted.' }));
                return;
              }

              fs.unlinkSync(resolvedTargetPath);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
              return;
            }
            
            // GET Request: List directory contents
            const files = fs.readdirSync(resolvedTargetDir, { withFileTypes: true });
            const fileList = files.map(file => ({
              name: file.name,
              isDirectory: file.isDirectory(),
              path: path.join(resolvedTargetDir, file.name)
            }));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ files: fileList, homeDir, currentPath: resolvedTargetDir }));
          } catch (error: unknown) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to read directory' }));
          }
        });
      }
    }
  ],
})
