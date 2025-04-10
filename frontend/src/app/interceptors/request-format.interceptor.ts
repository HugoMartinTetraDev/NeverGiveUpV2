import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';

export const requestFormatInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Intercepter uniquement les requêtes POST vers l'API d'inscription
  if (req.method === 'POST' && req.url.includes('auth/register') && req.body) {
    // Cloner le corps de la requête pour le modifier
    const body = { ...req.body as Record<string, any> };
    
    console.log('Corps de requête original:', body);
    
    // Transformer les données pour correspondre à ce qu'attend l'API
    
    // Conversion des rôles du frontend vers le backend
    if (body['roles'] && Array.isArray(body['roles'])) {
      // Map les rôles du frontend vers les rôles du backend
      const roleMapping: Record<string, string> = {
        'customer': 'CLIENT',
        'restaurantOwner': 'RESTAURATEUR',
        'deliverer': 'LIVREUR',
        'developer': 'ADMIN'
      };
      
      // Si c'est un tableau de rôles, prendre le premier et le convertir
      const frontendRole = body['roles'][0];
      body['role'] = roleMapping[frontendRole] || 'CLIENT'; // Valeur par défaut si mapping non trouvé
      
      console.log(`Conversion de rôle: ${frontendRole} -> ${body['role']}`);
      
      // Supprimer le tableau de rôles car le backend n'en a pas besoin
      delete body['roles'];
    } else if (!body['role']) {
      // Si ni roles ni role n'est défini, définir CLIENT par défaut
      body['role'] = 'CLIENT';
    }
    
    // Formater la date de naissance si elle existe
    if (body['birthDate'] && typeof body['birthDate'] === 'string') {
      try {
        const date = new Date(body['birthDate']);
        if (!isNaN(date.getTime())) {
          // Utiliser le format yyyy-MM-dd
          const isoDate = date.toISOString().split('T')[0];
          body['birthDate'] = isoDate;
        }
      } catch (error) {
        console.warn('Erreur lors du formatage de la date de naissance', error);
        
        // Si la date est invalide, utiliser une date par défaut plutôt que de planter
        body['birthDate'] = new Date().toISOString().split('T')[0];
      }
    } else if (!body['birthDate']) {
      // Si la date de naissance n'est pas fournie, fournir une valeur par défaut
      // car c'est un champ obligatoire dans le backend
      body['birthDate'] = new Date().toISOString().split('T')[0];
    }
    
    // Vérifier et gérer les champs obligatoires
    const requiredFields = ['email', 'password', 'firstName', 'lastName', 'address'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.warn(`Champs obligatoires manquants: ${missingFields.join(', ')}`);
      
      // Fournir au moins une valeur vide pour les champs obligatoires
      missingFields.forEach(field => {
        body[field] = '';
      });
    }
    
    // Nettoyer les propriétés vides ou non pertinentes
    Object.keys(body).forEach(key => {
      if (body[key] === '' || body[key] === null || body[key] === undefined) {
        // Ne pas supprimer les champs obligatoires même s'ils sont vides
        if (!requiredFields.includes(key)) {
          delete body[key];
        }
      }
    });
    
    // Propriétés à supprimer si elles existent mais ne sont pas nécessaires
    const nonApiProperties = [
      'city', 'zipCode', 'confirmPassword', 
      'restaurantName', 'restaurantDescription', 'cuisineType',
      'restaurantAddress', 'restaurantCity', 'restaurantZipCode',
      'restaurantPhone', 'deliveryFee', 'delivererPhoneNumber', 
      'delivererSiretNumber', 'accountHolderName'
    ];
    
    nonApiProperties.forEach(prop => {
      if (prop in body) {
        delete body[prop];
      }
    });
    
    // Traitement spécial pour les champs spécifiques selon le rôle
    if (body['role'] === 'RESTAURATEUR' && body['siretNumber']) {
      // Copier siretNumber vers siret pour le backend
      body['siret'] = body['siretNumber'];
      delete body['siretNumber'];
    }
    
    if (body['role'] === 'LIVREUR' && body['delivererSiretNumber']) {
      // Copier delivererSiretNumber vers siret pour le backend
      body['siret'] = body['delivererSiretNumber'];
      delete body['delivererSiretNumber'];
    }
    
    // Créer une nouvelle requête avec le corps modifié
    const modifiedReq = req.clone({ 
      body: body
    });
    
    console.log('Requête d\'inscription formatée:', modifiedReq.body);
    return next(modifiedReq);
  }
  
  // Si ce n'est pas une requête d'inscription, laisser passer sans modification
  return next(req);
}; 