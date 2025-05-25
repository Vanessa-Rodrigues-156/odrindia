import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon to use ws for WebSocket connections
neonConfig.webSocketConstructor = ws;

// Ensure DATABASE_URL is defined
const connectionString = process.env.DATABASE_URL as string;
if (!connectionString) {
    console.error('DATABASE_URL environment variable is not set');
    throw new Error('DATABASE_URL environment variable is not set');
}

// Function to initialize Prisma with retry logic
const initPrismaClient = () => {
    try {
        // Create Neon adapter with connection pooling options
        const adapter = new PrismaNeon({ 
            connectionString,
        });

        return new PrismaClient({
            adapter,
            log: ['error', 'warn'],
        });
    } catch (error) {
        console.error('Failed to initialize Prisma client:', error);
        
        // In development, we can use a mock or fallback
        if (process.env.NODE_ENV === 'development') {
            console.warn('Using development fallback for database');
            return new PrismaClient();
        }
        throw error;
    }
};

// Augment global type for TypeScript
declare global {
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Use a singleton pattern for PrismaClient with initialization
export const prisma = global.prisma || initPrismaClient();

if (process.env.NODE_ENV !== 'production') {
    // Prevents the Prisma Client from being instantiated multiple times in development
    global.prisma = prisma;
}

export default prisma;