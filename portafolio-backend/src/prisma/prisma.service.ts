import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  INestApplication,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService
 * Extiende PrismaClient para integrarlo con el ciclo de vida de NestJS.
 * Se inyecta en cualquier servicio que necesite acceso a la base de datos.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  /**
   * Habilita el cierre ordenado de la app cuando Prisma
   * recibe señales de apagado (útil en producción/Docker).
   */
  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}