import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Démarrage du seeding...');

  // Supprimer les données existantes (dans l'ordre inverse des dépendances)
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.article.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.config.deleteMany();
  await prisma.log.deleteMany();

  console.log('Données existantes supprimées.');

  // Créer des utilisateurs
  const hashPassword = await bcrypt.hash('password123', 10);
  
  // Admin
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashPassword,
      firstName: 'Admin',
      lastName: 'Système',
      birthDate: new Date('1990-01-01'),
      address: '123 Rue de l\'Administration, Paris',
      phoneNumber: '0612345678',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'ADMIN'
        }
      }
    }
  });
  
  // Restaurateurs
  const restaurateur1 = await prisma.user.create({
    data: {
      email: 'chef@lebistro.fr',
      password: hashPassword,
      firstName: 'Pierre',
      lastName: 'Dupont',
      birthDate: new Date('1985-05-15'),
      address: '45 Avenue des Gourmets, Lyon',
      phoneNumber: '0687654321',
      siret: '12345678901234',
      iban: 'FR7630006000011234567890189',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'RESTAURATEUR'
        }
      }
    }
  });
  
  const restaurateur2 = await prisma.user.create({
    data: {
      email: 'sophie@lapizzeria.fr',
      password: hashPassword,
      firstName: 'Sophie',
      lastName: 'Martin',
      birthDate: new Date('1978-09-23'),
      address: '78 Rue de Naples, Marseille',
      phoneNumber: '0698765432',
      siret: '98765432109876',
      iban: 'FR7630006000011234567890190',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'RESTAURATEUR'
        }
      }
    }
  });
  
  // Livreurs
  const livreur1 = await prisma.user.create({
    data: {
      email: 'jean@livraison.fr',
      password: hashPassword,
      firstName: 'Jean',
      lastName: 'Lefebvre',
      birthDate: new Date('1995-03-12'),
      address: '12 Rue de la Livraison, Paris',
      phoneNumber: '0678901234',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'LIVREUR'
        }
      }
    }
  });
  
  const livreur2 = await prisma.user.create({
    data: {
      email: 'marie@livraison.fr',
      password: hashPassword,
      firstName: 'Marie',
      lastName: 'Dubois',
      birthDate: new Date('1992-07-25'),
      address: '34 Avenue du Transport, Lyon',
      phoneNumber: '0645678901',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'LIVREUR'
        }
      }
    }
  });
  
  // Clients
  const client1 = await prisma.user.create({
    data: {
      email: 'client1@example.com',
      password: hashPassword,
      firstName: 'Thomas',
      lastName: 'Bernard',
      birthDate: new Date('1988-11-30'),
      address: '56 Rue de la Paix, Paris',
      phoneNumber: '0612345987',
      referralCode: 'THOMAS2024',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'CLIENT'
        }
      }
    }
  });
  
  const client2 = await prisma.user.create({
    data: {
      email: 'client2@example.com',
      password: hashPassword,
      firstName: 'Laura',
      lastName: 'Petit',
      birthDate: new Date('1993-04-17'),
      address: '89 Boulevard Haussmann, Paris',
      phoneNumber: '0623456789',
      referralCode: 'LAURA2024',
      status: 'ACTIVE',
      userRoles: {
        create: {
          role: 'CLIENT'
        }
      }
    }
  });
  
  console.log('Utilisateurs créés.');
  
  // Créer des restaurants
  const leBistro = await prisma.restaurant.create({
    data: {
      name: 'Le Bistro Parisien',
      city: 'Paris',
      address: '45 Rue de Rivoli, Paris',
      phoneNumber: '0145789632',
      deliveryFees: 3.99,
      description: 'Cuisine française traditionnelle avec des produits frais et locaux.',
      status: 'ACTIVE',
      zipCode: '75001',
      ownerId: restaurateur1.id
    }
  });
  
  const laPizzeria = await prisma.restaurant.create({
    data: {
      name: 'La Pizzeria',
      city: 'Marseille',
      address: '78 Rue de Naples, Marseille',
      phoneNumber: '0491234567',
      deliveryFees: 2.99,
      description: 'Authentiques pizzas italiennes cuites au feu de bois.',
      status: 'ACTIVE',
      zipCode: '13006',
      ownerId: restaurateur2.id
    }
  });
  
  const sushiExpress = await prisma.restaurant.create({
    data: {
      name: 'Sushi Express',
      city: 'Lyon',
      address: '123 Avenue de Saxe, Lyon',
      phoneNumber: '0472123456',
      deliveryFees: 4.99,
      description: 'Sushis et spécialités japonaises préparés par nos chefs.',
      status: 'ACTIVE',
      zipCode: '69003'
    }
  });
  
  console.log('Restaurants créés.');
  
  // Créer des articles pour Le Bistro Parisien
  const entree1 = await prisma.article.create({
    data: {
      name: 'Soupe à l\'oignon',
      description: 'Soupe à l\'oignon traditionnelle avec croûtons et fromage gratiné',
      price: 7.50,
      type: 'entree',
      restaurantId: leBistro.id
    }
  });
  
  const entree2 = await prisma.article.create({
    data: {
      name: 'Salade Niçoise',
      description: 'Salade fraîche avec thon, œufs, olives et légumes de saison',
      price: 9.00,
      type: 'entree',
      restaurantId: leBistro.id
    }
  });
  
  const plat1 = await prisma.article.create({
    data: {
      name: 'Bœuf Bourguignon',
      description: 'Mijoté de bœuf au vin rouge, carottes et champignons',
      price: 16.50,
      type: 'plat',
      restaurantId: leBistro.id
    }
  });
  
  const plat2 = await prisma.article.create({
    data: {
      name: 'Coq au Vin',
      description: 'Poulet mijoté au vin rouge avec lardons et champignons',
      price: 15.00,
      type: 'plat',
      restaurantId: leBistro.id
    }
  });
  
  const dessert1 = await prisma.article.create({
    data: {
      name: 'Crème Brûlée',
      description: 'Crème à la vanille avec caramel croquant',
      price: 6.50,
      type: 'dessert',
      restaurantId: leBistro.id
    }
  });
  
  const dessert2 = await prisma.article.create({
    data: {
      name: 'Tarte Tatin',
      description: 'Tarte aux pommes caramélisées servie tiède',
      price: 7.00,
      type: 'dessert',
      restaurantId: leBistro.id
    }
  });
  
  // Créer des articles pour La Pizzeria
  const pizza1 = await prisma.article.create({
    data: {
      name: 'Margherita',
      description: 'Sauce tomate, mozzarella et basilic frais',
      price: 10.00,
      type: 'plat',
      restaurantId: laPizzeria.id
    }
  });
  
  const pizza2 = await prisma.article.create({
    data: {
      name: 'Reine',
      description: 'Sauce tomate, mozzarella, jambon et champignons',
      price: 12.00,
      type: 'plat',
      restaurantId: laPizzeria.id
    }
  });
  
  const pizza3 = await prisma.article.create({
    data: {
      name: '4 Fromages',
      description: 'Sauce tomate, mozzarella, gorgonzola, chèvre et parmesan',
      price: 13.50,
      type: 'plat',
      restaurantId: laPizzeria.id
    }
  });
  
  const tiramisu = await prisma.article.create({
    data: {
      name: 'Tiramisu',
      description: 'Dessert au mascarpone et café',
      price: 6.50,
      type: 'dessert',
      restaurantId: laPizzeria.id
    }
  });
  
  // Créer des articles pour Sushi Express
  const maki = await prisma.article.create({
    data: {
      name: 'Maki Saumon (6 pièces)',
      description: 'Rouleaux de riz avec saumon frais et avocat',
      price: 7.50,
      type: 'plat',
      restaurantId: sushiExpress.id
    }
  });
  
  const california = await prisma.article.create({
    data: {
      name: 'California Roll (6 pièces)',
      description: 'Rouleaux inversés avec avocat, surimi et concombre',
      price: 8.00,
      type: 'plat',
      restaurantId: sushiExpress.id
    }
  });
  
  const sashimi = await prisma.article.create({
    data: {
      name: 'Sashimi Saumon (9 pièces)',
      description: 'Tranches fines de saumon cru',
      price: 12.00,
      type: 'plat',
      restaurantId: sushiExpress.id
    }
  });
  
  console.log('Articles créés.');
  
  // Créer des menus
  const menuBistro1 = await prisma.menu.create({
    data: {
      name: 'Menu Parisien',
      description: 'Entrée + Plat + Dessert',
      price: 25.00,
      restaurantId: leBistro.id,
      items: {
        connect: [
          { id: entree1.id },
          { id: plat1.id },
          { id: dessert1.id }
        ]
      }
    }
  });
  
  const menuBistro2 = await prisma.menu.create({
    data: {
      name: 'Menu Gourmand',
      description: 'Entrée + Plat + Dessert',
      price: 28.00,
      restaurantId: leBistro.id,
      items: {
        connect: [
          { id: entree2.id },
          { id: plat2.id },
          { id: dessert2.id }
        ]
      }
    }
  });
  
  const menuPizzeria = await prisma.menu.create({
    data: {
      name: 'Menu Napolitain',
      description: 'Pizza au choix + Tiramisu',
      price: 16.50,
      restaurantId: laPizzeria.id,
      items: {
        connect: [
          { id: pizza1.id },
          { id: tiramisu.id }
        ]
      }
    }
  });
  
  const menuSushi = await prisma.menu.create({
    data: {
      name: 'Menu Découverte',
      description: 'Assortiment de sushis variés',
      price: 22.00,
      restaurantId: sushiExpress.id,
      items: {
        connect: [
          { id: maki.id },
          { id: california.id },
          { id: sashimi.id }
        ]
      }
    }
  });
  
  console.log('Menus créés.');
  
  // Créer des commandes
  const order1 = await prisma.order.create({
    data: {
      userId: client1.id,
      restaurantId: leBistro.id,
      deliveryAddress: '56 Rue de la Paix, Paris',
      totalAmount: 31.99,
      deliveryFees: 3.99,
      serviceFees: 2.00,
      status: 'DELIVERED',
      paymentMethod: 'CARTE',
      timestamps: {
        created: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        accepted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 5 * 60 * 1000),
        ready: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
        delivered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 55 * 60 * 1000)
      },
      deliveryPersonId: livreur1.id,
      orderItems: {
        create: [
          {
            articleId: plat1.id,
            quantity: 1
          },
          {
            articleId: dessert1.id,
            quantity: 2
          }
        ]
      }
    }
  });
  
  const order2 = await prisma.order.create({
    data: {
      userId: client2.id,
      restaurantId: laPizzeria.id,
      deliveryAddress: '89 Boulevard Haussmann, Paris',
      totalAmount: 24.99,
      deliveryFees: 2.99,
      serviceFees: 2.00,
      status: 'DELIVERED',
      paymentMethod: 'CARTE',
      timestamps: {
        created: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        accepted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 1000),
        ready: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000),
        delivered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000)
      },
      deliveryPersonId: livreur2.id,
      orderItems: {
        create: [
          {
            articleId: pizza2.id,
            quantity: 1
          },
          {
            articleId: pizza3.id,
            quantity: 1
          }
        ]
      }
    }
  });
  
  const order3 = await prisma.order.create({
    data: {
      userId: client1.id,
      restaurantId: sushiExpress.id,
      deliveryAddress: '56 Rue de la Paix, Paris',
      totalAmount: 26.99,
      deliveryFees: 4.99,
      serviceFees: 2.00,
      status: 'IN_PROGRESS',
      paymentMethod: 'CARTE',
      timestamps: {
        created: new Date(Date.now() - 30 * 60 * 1000),
        accepted: new Date(Date.now() - 25 * 60 * 1000),
        inProgress: new Date(Date.now() - 15 * 60 * 1000)
      },
      deliveryPersonId: livreur1.id,
      orderItems: {
        create: [
          {
            articleId: maki.id,
            quantity: 1
          },
          {
            articleId: california.id,
            quantity: 2
          }
        ]
      }
    }
  });
  
  const order4 = await prisma.order.create({
    data: {
      userId: client2.id,
      restaurantId: leBistro.id,
      deliveryAddress: '89 Boulevard Haussmann, Paris',
      totalAmount: 28.99,
      deliveryFees: 3.99,
      serviceFees: 2.00,
      status: 'PENDING',
      paymentMethod: 'CARTE',
      timestamps: {
        created: new Date()
      },
      orderItems: {
        create: [
          {
            articleId: entree1.id,
            quantity: 1
          },
          {
            articleId: plat2.id,
            quantity: 1
          }
        ]
      }
    }
  });
  
  console.log('Commandes créées.');
  
  // Ajouter quelques notifications
  await prisma.notification.create({
    data: {
      userId: client1.id,
      type: 'ORDER_STATUS',
      template: 'order_delivered',
      content: {
        orderId: order1.id,
        restaurantName: leBistro.name
      }
    }
  });
  
  await prisma.notification.create({
    data: {
      userId: client2.id,
      type: 'ORDER_STATUS',
      template: 'order_delivered',
      content: {
        orderId: order2.id,
        restaurantName: laPizzeria.name
      }
    }
  });
  
  console.log('Notifications créées.');
  
  // Ajouter des configurations
  await prisma.config.create({
    data: {
      key: 'SERVICE_FEES',
      value: '2.00'
    }
  });
  
  await prisma.config.create({
    data: {
      key: 'MAX_DELIVERY_DISTANCE',
      value: '15'
    }
  });
  
  console.log('Configurations créées.');
  
  console.log('Seeding terminé avec succès!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 