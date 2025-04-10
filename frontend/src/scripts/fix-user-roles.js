/**
 * Script de correction des données utilisateur dans le localStorage
 * A exécuter dans la console du navigateur en cas de problème d'affichage des rôles
 */

(function() {
  console.log('Début de la correction des données utilisateur...');
  
  // Récupérer les données utilisateur depuis le localStorage
  const userData = localStorage.getItem('user_data');
  
  if (!userData) {
    console.log('Aucune donnée utilisateur trouvée dans le localStorage.');
    return;
  }
  
  try {
    // Parser les données utilisateur
    const user = JSON.parse(userData);
    console.log('Données utilisateur actuelles:', user);
    
    // Récupérer le rôle principal
    let mainRole = null;
    
    if (user.role) {
      // Si un rôle unique est défini, l'utiliser comme rôle principal
      mainRole = user.role;
      console.log('Rôle unique trouvé:', mainRole);
    } else if (user.roles && Array.isArray(user.roles) && user.roles.length > 0) {
      // Si un tableau de rôles est défini, utiliser le premier comme rôle principal
      mainRole = user.roles[0];
      console.log('Rôle principal trouvé dans le tableau:', mainRole);
    } else {
      console.log('Aucun rôle trouvé pour l\'utilisateur.');
      return;
    }
    
    // Convertir le rôle en majuscules pour normalisation
    mainRole = String(mainRole).toUpperCase();
    
    // Mise à jour des données utilisateur
    user.role = mainRole;
    user.roles = [mainRole];
    
    // Sauvegarder les données utilisateur mises à jour
    localStorage.setItem('user_data', JSON.stringify(user));
    console.log('Données utilisateur mises à jour:', user);
    
    // Signaler qu'un rafraîchissement est nécessaire
    console.log('Données utilisateur corrigées avec succès. Veuillez rafraîchir la page pour appliquer les changements.');
  } catch (error) {
    console.error('Erreur lors de la correction des données utilisateur:', error);
  }
})(); 