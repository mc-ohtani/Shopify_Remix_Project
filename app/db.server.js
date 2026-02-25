// app/db.server.ts
import { PrismaClient } from "@prisma/client";

// テスト用：URLを直接書く（昨日書き換えたURLと同じもの）
const databaseUrl = "postgres://postgres:xZObYWL6F2sR8B1J@db.pvoilibkvkbsbcwwilqi.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

export default prisma;