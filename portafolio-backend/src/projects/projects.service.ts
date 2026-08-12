import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectDto } from './dto/query-project.dto';

// Include reutilizable: siempre devolvemos el proyecto con su
// tecnología y galería resueltas, para que el frontend no tenga
// que hacer llamadas adicionales por proyecto.
const PROJECT_INCLUDE = {
  technologies: {
    include: { skill: true },
    orderBy: { isPrimary: 'desc' as const },
  },
  gallery: {
    orderBy: { order: 'asc' as const },
  },
} satisfies Prisma.ProjectInclude;

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lista los proyectos para el showcase, con soporte de filtros
   * opcionales por "featured" y por tecnología.
   */
  async findAll(query: QueryProjectDto) {
    const where: Prisma.ProjectWhereInput = {};

    if (query.featured !== undefined) {
      where.featured = query.featured === 'true';
    }

    if (query.technology) {
      where.technologies = {
        some: {
          skill: {
            name: { equals: query.technology, mode: 'insensitive' },
          },
        },
      };
    }

    return this.prisma.project.findMany({
      where,
      include: PROJECT_INCLUDE,
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    });
  }

  /**
   * Obtiene un proyecto por su slug (usado en rutas amigables /proyectos/gachadex).
   */
  async findOneBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: PROJECT_INCLUDE,
    });

    if (!project) {
      throw new NotFoundException(
        `No se encontró un proyecto con el slug "${slug}"`,
      );
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    await this.assertSlugIsUnique(dto.slug);

    const { technologies, gallery, ...projectData } = dto;

    return this.prisma.project.create({
      data: {
        ...projectData,
        technologies: technologies
          ? {
              create: technologies.map((t) => ({
                isPrimary: t.isPrimary ?? false,
                skill: { connect: { id: t.skillId } },
              })),
            }
          : undefined,
        gallery: gallery
          ? {
              create: gallery.map((img) => ({
                url: img.url,
                alt: img.alt,
                order: img.order ?? 0,
              })),
            }
          : undefined,
      },
      include: PROJECT_INCLUDE,
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.assertProjectExists(id);

    if (dto.slug) {
      await this.assertSlugIsUnique(dto.slug, id);
    }

    const { technologies, gallery, ...projectData } = dto;

    return this.prisma.project.update({
      where: { id },
      data: {
        ...projectData,
        // Si vienen tecnologías nuevas, reemplazamos la relación completa
        ...(technologies && {
          technologies: {
            deleteMany: {},
            create: technologies.map((t) => ({
              isPrimary: t.isPrimary ?? false,
              skill: { connect: { id: t.skillId } },
            })),
          },
        }),
        ...(gallery && {
          gallery: {
            deleteMany: {},
            create: gallery.map((img) => ({
              url: img.url,
              alt: img.alt,
              order: img.order ?? 0,
            })),
          },
        }),
      },
      include: PROJECT_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.assertProjectExists(id);
    await this.prisma.project.delete({ where: { id } });
    return { message: 'Proyecto eliminado correctamente' };
  }

  // -------------------------------------------------------
  // Helpers privados
  // -------------------------------------------------------

  private async assertProjectExists(id: string) {
    const exists = await this.prisma.project.findUnique({ where: { id } });
    if (!exists) {
      throw new NotFoundException(`No se encontró el proyecto con id "${id}"`);
    }
  }

  private async assertSlugIsUnique(slug: string, excludeId?: string) {
    const existing = await this.prisma.project.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException(
        `Ya existe un proyecto con el slug "${slug}"`,
      );
    }
  }
}