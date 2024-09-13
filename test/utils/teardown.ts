import { PrismaClient } from '@prisma/client';

const teardown = async () => {
  if (global.postgres) {
    await global.postgres.stop();
  }

  const prisma = new PrismaClient();
  await prisma.$disconnect();
};

export default teardown;
