import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

/** создает клиент Prisma для seed */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Переменная DATABASE_URL не задана');
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

/** добавляет отсутствующую тестовую запись без создания дубля */
async function seedTestRecords(prisma: PrismaClient): Promise<void> {
  const testRecordNames = ['Первая тестовая запись', 'Вторая тестовая запись'];
  const existingRecords = await prisma.testRecord.findMany({
    where: {
      name: {
        in: testRecordNames,
      },
    },
    select: {
      name: true,
    },
  });
  const existingNames = new Set(existingRecords.map((record) => record.name));
  const missingRecords = testRecordNames
    .filter((name) => !existingNames.has(name))
    .map((name) => ({ name }));

  if (missingRecords.length === 0) {
    return;
  }

  await prisma.testRecord.createMany({
    data: missingRecords,
  });
}

/** выполняет seed и гарантированно закрывает соединение */
async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    await seedTestRecords(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
