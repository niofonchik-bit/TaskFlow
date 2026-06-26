import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';

/** создает клиент Prisma для seed */
function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('переменная DATABASE_URL не задана');
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({ adapter });
}

/** добавляет системную роль без создания дубля */
async function seedSystemRole(
  prisma: PrismaClient,
  key: string,
  name: string,
): Promise<void> {
  const existingRole = await prisma.roles.findFirst({
    where: {
      organization_id: null,
      key,
    },
    select: {
      id: true,
    },
  });

  if (existingRole) {
    await prisma.roles.update({
      where: {
        id: existingRole.id,
      },
      data: {
        name,
        is_system: true,
      },
    });

    return;
  }

  await prisma.roles.create({
    data: {
      key,
      name,
      is_system: true,
    },
  });
}

/** добавляет базовые системные роли для организаций */
async function seedSystemRoles(prisma: PrismaClient): Promise<void> {
  await seedSystemRole(prisma, 'owner', 'Владелец');
  await seedSystemRole(prisma, 'admin', 'Администратор');
  await seedSystemRole(prisma, 'member', 'Участник');
}

/** выполняет seed и гарантированно закрывает соединение */
async function main(): Promise<void> {
  const prisma = createPrismaClient();

  try {
    await seedSystemRoles(prisma);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
