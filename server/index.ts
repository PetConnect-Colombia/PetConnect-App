/**
 * index.ts
 * Punto de entrada del servidor Express: seguridad, CORS, rutas y conexión a MongoDB.
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import 'express-async-errors'
import { env } from './config/env'
import { connectDB } from './config/db'
import { authRouter } from './routes/auth'
import { petsRouter } from './routes/pets'
import { blogsRouter } from './routes/blogs'
import { donationsRouter } from './routes/donations'

const app = express()

// Middlewares base
app.use(helmet())
app.use(
  cors({
    origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN,
    credentials: true,
  })
)
app.use(express.json({ limit: '1mb' }))
app.use(morgan('dev'))

// Healthcheck
app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/pets', petsRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/donations', donationsRouter)

// Manejo de errores
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ message: 'Error interno del servidor' })
})

async function start() {
  await connectDB()
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`)
  })
}

start().catch((e) => {
  console.error('Failed to start server', e)
  process.exit(1)
})
