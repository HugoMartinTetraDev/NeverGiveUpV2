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
    if (body['birthDate']) {
      try {
        let date: Date;
        
        // Si c'est un objet Date, l'utiliser directement
        if (body['birthDate'] instanceof Date) {
          date = body['birthDate'];
        } 
        // Si c'est un string au format français JJ/MM/AAAA, le convertir
        else if (typeof body['birthDate'] === 'string' && body['birthDate'].includes('/')) {
          const parts = body['birthDate'].split('/');
          if (parts.length === 3) {
            // Créer une date au format Date (jour, mois-1, année)
            date = new Date(
              parseInt(parts[2]), // année
              parseInt(parts[1]) - 1, // mois (0-11)
              parseInt(parts[0]) // jour
            );
          } else {
            // Si le format n'est pas JJ/MM/AAAA, essayer de créer une date normalement
            date = new Date(body['birthDate']);
          }
        } 
        // Sinon, essayer de créer une date normalement
        else {
          date = new Date(body['birthDate']);
        }
        
        // Vérifier que la date est valide
        if (!isNaN(date.getTime())) {
          // Utiliser le format yyyy-MM-dd
          const isoDate = date.toISOString().split('T')[0];
          body['birthDate'] = isoDate;
          console.log('Date de naissance formatée:', isoDate);
        } else {
          console.warn('La date de naissance est invalide:', body['birthDate']);
          // Si la date est invalide, fournir une date par défaut
          body['birthDate'] = new Date().toISOString().split('T')[0];
        }
      } catch (error) {
        console.warn('Erreur lors du formatage de la date de naissance', error);
        
        // Si la date est invalide, fournir une date par défaut
        body['birthDate'] = new Date().toISOString().split('T')[0];
      }
    } else {
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

    // Validation du SIRET pour restaurateur et livreur
    if (body['role'] === 'RESTAURATEUR' || body['role'] === 'LIVREUR') {
      const siretSourceField = body['role'] === 'RESTAURATEUR' ? 'siretNumber' : 'delivererSiretNumber';
      
      // Vérifier que le SIRET est présent et valide (14 chiffres)
      if (body[siretSourceField] && /^\d{14}$/.test(body[siretSourceField])) {
        body['siret'] = body[siretSourceField];
      } else if (body[siretSourceField]) {
        // Si le SIRET est présent mais invalide, on le conserve tel quel pour que le backend puisse générer une erreur
        body['siret'] = body[siretSourceField];
        console.warn(`SIRET invalide pour ${body['role']}: ${body[siretSourceField]}`);
      } else {
        console.warn(`SIRET manquant pour ${body['role']}`);
      }
    }
    
    // Traitement spécial pour les champs spécifiques du restaurant
    if (body['role'] === 'RESTAURATEUR') {
      // Traiter les informations du restaurant si disponibles
      if (body['restaurantName']) {
        // Créer un objet pour les données du restaurant
        body['restaurant'] = {
          name: body['restaurantName'],
          description: body['restaurantDescription'] || '',
          city: body['restaurantCity'] || body['city'] || '',
          deliveryFees: parseFloat(body['deliveryFee']) || 0
        };
        
        // S'assurer que tous les champs obligatoires du restaurant sont présents
        if (!body['restaurant'].name) {
          console.warn('Nom du restaurant manquant');
        }
        
        // Ajouter l'adresse du restaurant si disponible
        if (body['restaurantAddress']) {
          body['restaurant'].address = body['restaurantAddress'];
        }
      }
    }
    
    // Traitement spécial pour les champs du livreur
    if (body['role'] === 'LIVREUR') {
      // Vérifier que l'IBAN est présent et valide
      if (body['iban'] && !/^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/.test(body['iban'])) {
        console.warn('Format IBAN invalide:', body['iban']);
      }
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
      'delivererSiretNumber', 'accountHolderName', 'siretNumber'
    ];
    
    nonApiProperties.forEach(prop => {
      if (prop in body) {
        delete body[prop];
      }
    });
    
    // Log final de la requête pour déboguer
    console.log('Requête d\'inscription formatée:', body);
    
    // Créer une nouvelle requête avec le corps modifié
    const modifiedReq = req.clone({ 
      body: body
    });
    
    return next(modifiedReq);
  }
  
  // Si ce n'est pas une requête d'inscription, laisser passer sans modification
  return next(req);
}; 