import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon to use ws for WebSocket connections
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is defined
const connectionString = process.env.DATABASE_URL as string;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create Neon adapter
const adapter = new PrismaNeon({ connectionString });

// Augment global type for TypeScript
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Use a singleton pattern for PrismaClient
export const prisma =
    global.prisma ||
    new PrismaClient({
        adapter,
    });

if (process.env.NODE_ENV !== 'development') {
    // Prevents the Prisma Client from being instantiated multiple times in development
    global.prisma = prisma;
}

export default prisma;