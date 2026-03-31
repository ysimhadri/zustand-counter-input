import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import url from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'home-dir-api',
      configureServer(server) {
        
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
