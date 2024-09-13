import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { Client } from 'pg';
import { PrismaService } from '../src/prisma/prisma.service';
import { spawnSync } from 'child_process';

let postgresContainer: StartedPostgreSqlContainer;
let postgresClient: Client;
let prismaService: PrismaService;

beforeAll(async () => {
  jest.setTimeout(60000);

  postgresContainer = await new PostgreSqlContainer().start();

  postgresClient = new Client({
    host: postgresContainer.getHost(),
    port: postgresContainer.getPort(),
    database: postgresContainer.getDatabase(),
    user: postgresContainer.getUsername(),
    password: postgresContainer.getPassword(),
  });

  await postgresClient.connect();

  const databaseUrl = `postgresql://${postgresClient.user}:${postgresClient.password}@${postgresClient.host}:${postgresClient.port}/${postgresClient.database}`;

  const migrate = spawnSync('npm', ['run', 'migrate'], {
    env: { ...process.env, DATABASE_URL: databaseUrl },
    stdio: 'inherit',
    shell: true,
  });

  if (migrate.error) {
    throw new Error(`Error ejecutando migraciones: ${migrate.error.message}`);
  }

  if (migrate.error) {
    throw new Error(`Error ejecutando migraciones: ${migrate.error.message}`);
  }

  prismaService = new PrismaService({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: ['query'],
  });

  console.log('Conectado a la base de datos de prueba...');
});

afterAll(async () => {
  if (postgresClient) {
    await postgresClient.end();
  }

  if (postgresContainer) {
    await postgresContainer.stop();
  }
  console.log('Base de datos de prueba detenida...');
});

jest.setTimeout(60000);

export { postgresClient, prismaService };
