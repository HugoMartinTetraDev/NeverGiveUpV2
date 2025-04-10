import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

interface TokenPayload {
  sub: string;
  email: string;
  roles: Role[];
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    // Récupérer l'utilisateur avec ses rôles
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        userRoles: true
      }
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      this.logger.warn(`Tentative de connexion échouée pour l'email: ${email}`);
      throw new UnauthorizedException('Identifiant ou mot de passe incorrect');
    }

    // Récupérer la liste des rôles de l'utilisateur
    const roles = user.userRoles.map(ur => ur.role);

    // Créer les tokens d'accès et de rafraîchissement
    const { accessToken, refreshToken } = this.generateTokens(user.id, user.email, roles);

    // Enregistrer l'événement de connexion
    await this.logLoginEvent(user.id, true);

    // Formater les données utilisateur pour le frontend
    const formattedUser = {
      ...user,
      roles,
      userRoles: undefined // Ne pas envoyer les données de la table intermédiaire
    };

    return {
      token: accessToken,
      refreshToken,
      user: formattedUser,
    };
  }

  async refreshToken(token: string) {
    try {
      // Vérifier que le refresh token est valide
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      });

      // Récupérer l'utilisateur avec ses rôles
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          userRoles: true
        }
      });

      if (!user) {
        throw new UnauthorizedException('Utilisateur non trouvé');
      }

      // Récupérer la liste des rôles de l'utilisateur
      const roles = user.userRoles.map(ur => ur.role);

      // Générer un nouveau token d'accès
      const { accessToken } = this.generateTokens(user.id, user.email, roles);
      const { password, ...userData } = user;

      // Formater les données utilisateur pour le frontend
      const formattedUser = {
        ...userData,
        roles,
        userRoles: undefined // Ne pas envoyer les données de la table intermédiaire
      };

      return {
        token: accessToken,
        user: formattedUser,
      };
    } catch (error) {
      this.logger.error(`Erreur lors du rafraîchissement du token: ${error.message}`);
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    address: string;
    roles: Role[];  // Tableau de rôles, maintenant obligatoire
    phoneNumber?: string;
    siret?: string;
    iban?: string;
  }) {
    // Vérifier si l'email existe déjà
    const existingUser = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // S'assurer qu'il y a au moins un rôle
    if (!userData.roles || userData.roles.length === 0) {
      userData.roles = [Role.CLIENT]; // Par défaut, attribuer le rôle CLIENT
    }

    // Créer l'utilisateur avec transaction pour assurer l'intégrité des données
    const result = await this.prisma.$transaction(async (tx) => {
      // Créer l'utilisateur sans les rôles
      const user = await tx.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthDate: userData.birthDate,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          siret: userData.siret,
          iban: userData.iban
        },
      });

      // Ajouter les rôles à l'utilisateur
      for (const role of userData.roles) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            role,
          },
        });
      }

      // Récupérer l'utilisateur complet avec ses rôles
      return await tx.user.findUnique({
        where: { id: user.id },
        include: {
          userRoles: true,
        },
      });
    });

    if (!result) {
      throw new Error("Échec de la création de l'utilisateur");
    }

    // Nettoyer les données sensibles en créant un nouvel objet sans le mot de passe
    const { password: _, ...userWithoutPassword } = result;

    // Formater les données utilisateur pour le frontend
    const formattedUser = {
      ...userWithoutPassword,
      roles: result.userRoles.map(ur => ur.role),
      userRoles: undefined // Ne pas envoyer les données de la table intermédiaire
    };

    // Générer les tokens
    const { accessToken, refreshToken } = this.generateTokens(
      result.id, 
      result.email, 
      formattedUser.roles
    );

    return {
      token: accessToken,
      refreshToken,
      user: formattedUser,
    };
  }

  // Ajouter un rôle à un utilisateur
  async addRoleToUser(userId: string, role: Role) {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new Error(`Utilisateur avec ID ${userId} non trouvé`);
      }

      // Vérifier si l'utilisateur a déjà ce rôle
      const existingRole = await this.prisma.userRole.findFirst({
        where: {
          userId,
          role,
        },
      });

      if (existingRole) {
        return { success: true, message: `L'utilisateur a déjà le rôle ${role}` };
      }

      // Ajouter le rôle
      await this.prisma.userRole.create({
        data: {
          userId,
          role,
        },
      });

      return { success: true, message: `Rôle ${role} ajouté à l'utilisateur` };
    } catch (error) {
      this.logger.error(`Erreur lors de l'ajout du rôle ${role} à l'utilisateur ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Supprimer un rôle d'un utilisateur
  async removeRoleFromUser(userId: string, role: Role) {
    try {
      // Vérifier si l'utilisateur existe
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: true,
        },
      });

      if (!user) {
        throw new Error(`Utilisateur avec ID ${userId} non trouvé`);
      }

      // Vérifier si c'est le dernier rôle de l'utilisateur
      if (user.userRoles.length === 1 && user.userRoles[0].role === role) {
        return { 
          success: false, 
          message: `Impossible de supprimer le rôle ${role} car c'est le seul rôle de l'utilisateur` 
        };
      }

      // Supprimer le rôle
      await this.prisma.userRole.deleteMany({
        where: {
          userId,
          role,
        },
      });

      return { success: true, message: `Rôle ${role} supprimé de l'utilisateur` };
    } catch (error) {
      this.logger.error(`Erreur lors de la suppression du rôle ${role} de l'utilisateur ${userId}: ${error.message}`);
      throw error;
    }
  }

  // Récupérer tous les rôles d'un utilisateur
  async getUserRoles(userId: string) {
    try {
      const userRoles = await this.prisma.userRole.findMany({
        where: {
          userId,
        },
      });

      return userRoles.map(ur => ur.role);
    } catch (error) {
      this.logger.error(`Erreur lors de la récupération des rôles de l'utilisateur ${userId}: ${error.message}`);
      throw error;
    }
  }

  private generateTokens(userId: string, email: string, roles: Role[]) {
    const payload: TokenPayload = { 
      sub: userId, 
      email: email, 
      roles: roles 
    };

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        { sub: userId },
        { 
          secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
          expiresIn: '7d' 
        }
      ),
    };
  }

  private async logLoginEvent(userId: string, success: boolean) {
    try {
      await this.prisma.log.create({
        data: {
          service: 'auth',
          level: success ? 'INFO' : 'WARNING',
          action: 'LOGIN',
          message: success ? 'Connexion réussie' : 'Échec de connexion',
          userId,
          timestamp: new Date(),
        },
      });
    } catch (error) {
      this.logger.error(`Erreur lors de l'enregistrement du log de connexion: ${error.message}`);
    }
  }
} 