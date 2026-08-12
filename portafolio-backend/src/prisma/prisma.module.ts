import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * @Global() permite que PrismaService esté disponible en toda la app
 * sin necesidad de reimportar PrismaModule en cada módulo de feature.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}