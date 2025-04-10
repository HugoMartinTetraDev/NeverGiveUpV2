import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

interface MicroserviceStatus {
  id: number;
  serviceName: string;
  cpuPerformance: string;
  status: 'Actif' | 'Inactif';
}

interface Log {
  id: number;
  dateTime: string;
  name: string;
}

@Component({
  selector: 'app-tech-logs',
  templateUrl: './tech-logs.component.html',
  styleUrls: ['./tech-logs.component.scss'],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule]
})
export class TechLogsComponent implements OnInit, OnDestroy {
  microservicesColumns: string[] = ['id', 'serviceName', 'cpuPerformance', 'status'];
  logsColumns: string[] = ['id', 'dateTime', 'name'];
  private cpuCheckInterval: any;

  microservices: MicroserviceStatus[] = [
    { id: 1, serviceName: 'log-service-dev', cpuPerformance: '0%', status: 'Actif' },
    { id: 2, serviceName: 'redis-1', cpuPerformance: '0%', status: 'Actif' },
    { id: 3, serviceName: 'postgres-1', cpuPerformance: '0%', status: 'Actif' },
    { id: 4, serviceName: 'auth-service-dev', cpuPerformance: '0%', status: 'Actif' },
    { id: 5, serviceName: 'order-service-dev', cpuPerformance: '0%', status: 'Actif' },
    { id: 6, serviceName: 'user-service-dev', cpuPerformance: '0%', status: 'Actif' },
    { id: 7, serviceName: 'api-gateway-dev', cpuPerformance: '0%', status: 'Actif' },
    { id: 8, serviceName: 'frontend-dev', cpuPerformance: '0%', status: 'Actif' }
  ];

  connectionLogs: Log[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    dateTime: '19/03/2025 15:05:13',
    name: 'Jhon Doe'
  }));

  downloadLogs: Log[] = Array.from({ length: 5 }, (_, i) => ({
    id: i + 6,
    dateTime: '19/03/2025 15:05:13',
    name: 'Jhon Doe'
  }));

  constructor() {}

  ngOnInit(): void {
    this.startCpuMonitoring();
  }

  ngOnDestroy(): void {
    if (this.cpuCheckInterval) {
      clearInterval(this.cpuCheckInterval);
    }
  }

  private startCpuMonitoring(): void {
    // Update CPU usage every 2 seconds
    this.cpuCheckInterval = setInterval(() => {
      // Update services with realistic CPU patterns based on Docker stats
      this.microservices = this.microservices.map(service => {
        let cpuUsage = 0;
        
        // Simulate realistic CPU patterns based on observed Docker stats
        switch (service.serviceName) {
          case 'log-service-dev':
            cpuUsage = 1.29 + (Math.random() * 0.2 - 0.1); // Around 1.29%
            break;
          case 'redis-1':
            cpuUsage = 0.38 + (Math.random() * 0.1 - 0.05); // Around 0.38%
            break;
          case 'postgres-1':
            cpuUsage = Math.random() * 0.1; // Near 0%
            break;
          case 'auth-service-dev':
            cpuUsage = Math.random() * 0.1; // Near 0%
            break;
          case 'order-service-dev':
            cpuUsage = Math.random() * 0.1; // Near 0%
            break;
          case 'user-service-dev':
            cpuUsage = 6.26 + (Math.random() * 0.5 - 0.25); // Around 6.26%
            break;
          case 'api-gateway-dev':
            cpuUsage = Math.random() * 0.1; // Near 0%
            break;
          case 'frontend-dev':
            cpuUsage = Math.random() * 0.1; // Near 0%
            break;
        }

        return {
          ...service,
          cpuPerformance: `${cpuUsage.toFixed(2)}%`,
          status: 'Actif'
        };
      });
    }, 2000);
  }
} 