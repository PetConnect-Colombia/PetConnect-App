/**
 * db.ts
 * Conexión a MongoDB con Mongoose.
 */
import mongoose from 'mongoose'
import { env } from './env'
// import mongoose from 'mongoose'
// import { env } from './env'

// /** Conecta a MongoDB y retorna la conexión */
// export async function connectDB() {
//   await mongoose.connect(env.MONGODB_URI)
//   return mongoose.connection
// }

// Exporta la función de conexión por defecto
export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI)
    console.log('✅ Conexión a MongoDB exitosa.')
    return mongoose.connection
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Error al conectar a MongoDB:', error.message)
    } else {
      console.error('❌ Error al conectar a MongoDB:', String(error))
    }
    // Puedes lanzar el error de nuevo si quieres que la aplicación se detenga
    // throw error
  }
}