import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface TechLog {
  id: string;
  componentId: string;
  type: 'error' | 'warning' | 'info' | 'debug';
  message: string;
  stackTrace?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface TechComponent {
  id: string;
  name: string;
  description: string;
  version: string;
  status: 'active' | 'deprecated' | 'maintenance';
  dependencies: string[];
  lastUpdated: Date;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class TechService {
  private mockTechLogs: TechLog[] = [
    {
      id: '1',
      componentId: '1',
      type: 'error',
      message: 'Failed to load component data',
      stackTrace: 'Error: Component not found\n    at TechService.getComponent',
      timestamp: new Date(),
      metadata: {
        browser: 'Chrome',
        version: '91.0.4472.124'
      }
    }
  ];

  private mockComponents: TechComponent[] = [
    {
      id: '1',
      name: 'Order Management',
      description: 'Handles order processing and management',
      version: '1.0.0',
      status: 'active',
      dependencies: ['auth', 'cart'],
      lastUpdated: new Date(),
      createdAt: new Date()
    }
  ];

  constructor() { }

  getTechLogs(componentId?: string): Observable<TechLog[]> {
    if (componentId) {
      return of(this.mockTechLogs.filter(log => log.componentId === componentId));
    }
    return of(this.mockTechLogs);
  }

  createTechLog(log: Omit<TechLog, 'id' | 'timestamp'>): Observable<TechLog> {
    const newLog: TechLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date()
    };
    this.mockTechLogs.push(newLog);
    return of(newLog);
  }

  getComponents(): Observable<TechComponent[]> {
    return of(this.mockComponents);
  }

  getComponent(id: string): Observable<TechComponent | undefined> {
    return of(this.mockComponents.find(component => component.id === id));
  }

  createComponent(component: Omit<TechComponent, 'id' | 'createdAt' | 'lastUpdated'>): Observable<TechComponent> {
    const newComponent: TechComponent = {
      ...component,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      lastUpdated: new Date()
    };
    this.mockComponents.push(newComponent);
    return of(newComponent);
  }

  updateComponent(component: TechComponent): Observable<TechComponent> {
    const index = this.mockComponents.findIndex(c => c.id === component.id);
    if (index !== -1) {
      this.mockComponents[index] = {
        ...component,
        lastUpdated: new Date()
      };
    }
    return of(component);
  }

  deleteComponent(id: string): Observable<boolean> {
    const index = this.mockComponents.findIndex(component => component.id === id);
    if (index !== -1) {
      this.mockComponents.splice(index, 1);
      return of(true);
    }
    return of(false);
  }

  getComponentDependencies(id: string): Observable<string[]> {
    const component = this.mockComponents.find(c => c.id === id);
    return of(component?.dependencies || []);
  }
} 