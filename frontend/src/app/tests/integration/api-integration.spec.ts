import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from '../../services/restaurant.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { Restaurant } from '../../models/restaurant.model';
import { Order } from '../../models/order.model';

describe('API Integration Tests', () => {
  let httpTestingController: HttpTestingController;
  let restaurantService: RestaurantService;
  let orderService: OrderService;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService, OrderService, AuthService]
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    restaurantService = TestBed.inject(RestaurantService);
    orderService = TestBed.inject(OrderService);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('RestaurantService integration', () => {
    it('should get restaurants from API', () => {
      const mockRestaurants: Restaurant[] = [
        { id: '1', name: 'Restaurant 1', address: 'Adresse 1', categories: ['Italian'], rating: 4.5, logo: 'logo1.jpg', menus: [], articles: [] },
        { id: '2', name: 'Restaurant 2', address: 'Adresse 2', categories: ['Japanese'], rating: 4.8, logo: 'logo2.jpg', menus: [], articles: [] },
      ];

      restaurantService.getRestaurants().subscribe((restaurants) => {
        expect(restaurants).toEqual(mockRestaurants);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/restaurants`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockRestaurants);
    });

    it('should get restaurant by id from API', () => {
      const mockRestaurant: Restaurant = {
        id: '1',
        name: 'Restaurant 1',
        address: 'Adresse 1',
        categories: ['Italian'],
        rating: 4.5,
        logo: 'logo1.jpg',
        menus: [],
        articles: []
      };

      restaurantService.getRestaurantById('1').subscribe((restaurant) => {
        expect(restaurant).toEqual(mockRestaurant);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/restaurants/1`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockRestaurant);
    });
  });

  describe('OrderService integration', () => {
    it('should get orders from API', () => {
      const mockOrders: Order[] = [
        { id: '1', restaurant: { id: '1', name: 'Restaurant 1', address: 'Adresse 1' }, items: [], total: 25.5, date: new Date(), status: [], userId: '1' },
        { id: '2', restaurant: { id: '2', name: 'Restaurant 2', address: 'Adresse 2' }, items: [], total: 35.8, date: new Date(), status: [], userId: '1' },
      ];

      orderService.getOrders().subscribe((orders) => {
        expect(orders).toEqual(mockOrders);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockOrders);
    });

    it('should create an order via API', () => {
      const newOrder: Partial<Order> = {
        restaurant: { id: '1', name: 'Restaurant 1', address: 'Adresse 1' },
        items: [{ id: '1', name: 'Item 1', price: 10.5, quantity: 2, image: 'item1.jpg' }],
        total: 21.0
      };

      const mockResponse: Order = {
        id: '3',
        restaurant: newOrder.restaurant!,
        items: newOrder.items!,
        total: newOrder.total!,
        date: new Date(),
        status: [{ status: 'Créée', timestamp: new Date() }],
        userId: '1'
      };

      orderService.createOrder(newOrder).subscribe((order) => {
        expect(order).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/orders`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(newOrder);
      req.flush(mockResponse);
    });
  });

  describe('AuthService integration', () => {
    it('should authenticate user via API', () => {
      const loginCredentials = {
        email: 'user@example.com',
        password: 'password123'
      };

      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: 'user@example.com',
          firstName: 'User',
          lastName: 'Test',
          role: 'CLIENT'
        }
      };

      authService.login(loginCredentials.email, loginCredentials.password).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(loginCredentials);
      req.flush(mockResponse);
    });

    it('should register user via API', () => {
      const registerData = {
        email: 'newuser@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'CLIENT'
      };

      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: '2',
          email: registerData.email,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          role: registerData.role
        }
      };

      authService.register(registerData).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toEqual('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockResponse);
    });
  });
}); 