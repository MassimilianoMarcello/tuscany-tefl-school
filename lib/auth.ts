import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // Il file che abbiamo sistemato prima

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // Specifica il tuo database
    }),
    // ... altre opzioni
});