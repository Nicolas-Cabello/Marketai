import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['error'],
  transactionOptions: {
    timeout: 5000, // 5 segundos timeout
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Función para verificar conexión
export async function checkPrismaConnection() {
  try {
    await prisma.$connect()
    return true
  } catch (error) {
    console.error('Prisma connection error:', error)
    return false
  }
}