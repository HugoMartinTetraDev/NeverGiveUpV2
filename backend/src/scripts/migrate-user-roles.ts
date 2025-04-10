import { PrismaClient, Role } from '@prisma/client';

interface BackupUser {
  id: string;
  role: Role;
}

/**
 * Script de migration pour transformer les rôles simples en rôles multiples
 */
async function migrateUserRoles() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting user roles migration...');
    
    // Récupérer tous les utilisateurs de la base de données temporaire et leurs rôles
    // Note : Cette approche dépend de la façon dont les rôles sont stockés dans la base de données temporaire
    const backupUsersRaw = await prisma.$queryRaw<BackupUser[]>`
      SELECT id, role FROM _prisma_migrations_shadow_User
    `;
    
    console.log(`📊 Found ${backupUsersRaw.length} users in backup table`);
    
    // Créer les rôles pour chaque utilisateur
    const userRoles: { userId: string; role: Role }[] = [];
    for (const user of backupUsersRaw) {
      if (user.id && user.role) {
        userRoles.push({
          userId: user.id,
          role: user.role,
        });
        
        console.log(`👤 Processed user ${user.id} with role ${user.role}`);
      }
    }
    
    // Créer les rôles en masse
    if (userRoles.length > 0) {
      console.log(`🔄 Creating ${userRoles.length} user roles...`);
      
      // Utiliser une transaction pour garantir l'atomicité
      await prisma.$transaction(
        userRoles.map(ur => 
          prisma.userRole.create({
            data: {
              userId: ur.userId,
              role: ur.role,
            },
          })
        )
      );
      
      console.log('✅ Migration completed successfully!');
    } else {
      console.log('⚠️ No roles to migrate');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUserRoles()
  .then(() => console.log('🎉 User roles migration script executed'))
  .catch(e => console.error('❌ Migration script error:', e)); 