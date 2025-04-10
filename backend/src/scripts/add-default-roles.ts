import { PrismaClient } from '@prisma/client';
import { Role } from '../common/enums';

/**
 * Script pour ajouter des rôles par défaut aux utilisateurs existants
 * À utiliser après la migration pour s'assurer que tous les utilisateurs ont au moins le rôle CLIENT
 */
async function addDefaultRoles() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🚀 Starting default roles assignment...');
    
    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany({
      include: {
        userRoles: true
      }
    });
    
    console.log(`📊 Found ${users.length} users in database`);
    
    // Pour chaque utilisateur, vérifier et ajouter les rôles
    for (const user of users) {
      console.log(`👤 Processing user ${user.id}`);
      
      // Si l'utilisateur n'a pas de rôles, lui donner le rôle CLIENT par défaut
      if (!user.userRoles || user.userRoles.length === 0) {
        console.log(`  Adding default CLIENT role to user ${user.id}`);
        
        await prisma.userRole.create({
          data: {
            userId: user.id,
            role: Role.CLIENT
          }
        });
      } else {
        console.log(`  User ${user.id} already has ${user.userRoles.length} roles`);
      }
    }
    
    console.log('✅ Default roles assignment completed successfully!');
    
  } catch (error) {
    console.error('❌ Default roles assignment failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addDefaultRoles()
  .then(() => console.log('🎉 Default roles assignment executed'))
  .catch(e => console.error('❌ Default roles assignment error:', e)); 