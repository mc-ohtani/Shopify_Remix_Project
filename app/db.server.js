import { PrismaClient } from "@prisma/client";

const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.SUPABASE_DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;