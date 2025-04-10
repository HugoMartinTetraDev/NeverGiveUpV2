/**
 * Script pour adapter les données utilisateur au nouveau système de rôles multiples
 * À exécuter dans la console du navigateur
 */
(function() {
  console.log('🔍 Vérification des données utilisateur dans localStorage...');
  
  // Récupérer les données utilisateur
  const userData = localStorage.getItem('user_data');
  if (!userData) {
    console.log('❌ Aucune donnée utilisateur trouvée dans localStorage.');
    return;
  }
  
  try {
    // Parser les données utilisateur
    const user = JSON.parse(userData);
    console.log('📊 Données utilisateur actuelles:', user);
    
    // Variables pour suivre les modifications
    let modified = false;
    
    // Cas 1: L'utilisateur a un rôle unique mais pas de tableau roles
    if (user.role && (!user.roles || !Array.isArray(user.roles) || user.roles.length === 0)) {
      console.log(`✏️ Conversion du rôle unique "${user.role}" en tableau`);
      user.roles = [user.role];
      modified = true;
    }
    
    // Cas 2: L'utilisateur a un tableau roles mais pas de rôle unique
    if (user.roles && Array.isArray(user.roles) && user.roles.length > 0 && !user.role) {
      console.log(`✏️ Ajout du premier rôle "${user.roles[0]}" comme rôle principal`);
      user.role = user.roles[0];
      modified = true;
    }
    
    // Cas 3: Conversion des rôles en majuscules pour la cohérence
    if (user.role) {
      const upperRole = String(user.role).toUpperCase();
      if (user.role !== upperRole) {
        console.log(`✏️ Conversion du rôle principal de "${user.role}" à "${upperRole}"`);
        user.role = upperRole;
        modified = true;
      }
    }
    
    if (user.roles && Array.isArray(user.roles)) {
      const rolesChanged = user.roles.some((role, index) => {
        const upperRole = String(role).toUpperCase();
        if (role !== upperRole) {
          console.log(`✏️ Conversion du rôle "${role}" à "${upperRole}"`);
          user.roles[index] = upperRole;
          return true;
        }
        return false;
      });
      
      if (rolesChanged) {
        modified = true;
      }
    }
    
    // Sauvegarder les modifications si nécessaire
    if (modified) {
      localStorage.setItem('user_data', JSON.stringify(user));
      console.log('✅ Données utilisateur mises à jour dans localStorage:', user);
      console.log('🔄 Veuillez rafraîchir la page pour appliquer les changements.');
    } else {
      console.log('✅ Aucune modification nécessaire, les données sont déjà au bon format.');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du traitement des données utilisateur:', error);
  }
})(); 