import { PrismaClient } from "@prisma/client";

// 念のため、独自変数と標準変数の両方をチェック
const connectionString = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;

const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    // 💡 実行時に強制的に接続先とエンジンを指定する
    datasources: {
      db: {
        url: connectionString,
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma;
}

export default prisma;