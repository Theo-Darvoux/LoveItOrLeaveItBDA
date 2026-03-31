import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function createServer() {
  const app = express()

  /** @type {import('vite').ViteDevServer} */
  let vite
  if (process.env.NODE_ENV !== 'production') {
    vite = await (
      await import('vite')
    ).createServer({
      server: { middlewareMode: true },
      appType: 'custom'
    })

    app.use(vite.middlewares)
  } else {
    app.use((await import('compression')).default())
    app.use(
      (await import('serve-static')).default(path.resolve(__dirname, 'dist/client'), {
        index: false
      })
    )
  }

  app.get(/.*/, async (req, res) => {
    const url = req.originalUrl
    
    // Simple language detection
    const acceptLang = req.get('Accept-Language') || 'fr'
    const lang = acceptLang.split(',')[0].split('-')[0]
    const finalLang = ['en', 'fr'].includes(lang) ? lang : 'fr'

    try {
      let template, render
      if (process.env.NODE_ENV !== 'production') {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        render = (await vite.ssrLoadModule('/src/entry-server.tsx')).render
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8')
        render = (await import('./dist/server/entry-server.js')).render
      }

      const { html: appHtml } = await render(url, finalLang)

      let html = template.replace(`<!--ssr-outlet-->`, appHtml)
      
      // Update HTML lang attribute
      html = html.replace(/<html lang="[^"]*">/, `<html lang="${finalLang}">`)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        vite.ssrFixStacktrace(e)
      }
      console.error(e.stack)
      res.status(500).end(e.stack)
    }
  })

  return { app }
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('http://localhost:3000')
  })
)
