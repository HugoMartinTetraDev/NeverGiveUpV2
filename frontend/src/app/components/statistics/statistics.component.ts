import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Statistics, RevenueDataPoint } from '../../models/statistics.model';

type Period = 'current' | 'last3' | 'last6' | 'year';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatSelectModule,
    MatProgressSpinnerModule,
    NgxChartsModule
  ],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatisticsComponent implements OnInit {
  isLoading = true;
  selectedPeriod: Period = 'current';
  
  // Full dataset
  private fullStatistics: Statistics = {
    currentMonth: {
      revenue: 12349.59,
      orderCount: 835,
      averageTicket: 23.56
    },
    revenueAnalysis: [
      { month: 'Jan', revenue: 25000, orders: 350 },
      { month: 'Feb', revenue: 42000, orders: 420 },
      { month: 'Mar', revenue: 65000, orders: 550 },
      { month: 'Apr', revenue: 52000, orders: 230 },
      { month: 'May', revenue: 45000, orders: 250 },
      { month: 'Jun', revenue: 48000, orders: 580 },
      { month: 'Jul', revenue: 53000, orders: 640 },
      { month: 'Aug', revenue: 40000, orders: 580 },
      { month: 'Sep', revenue: 47000, orders: 520 },
      { month: 'Oct', revenue: 45000, orders: 280 },
      { month: 'Nov', revenue: 43000, orders: 260 },
      { month: 'Dec', revenue: 25000, orders: 320 }
    ]
  };

  // Filtered statistics based on selected period
  statistics: Statistics = { ...this.fullStatistics };

  // Chart options
  view: [number, number] = [600, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Month';
  showYAxisLabel = true;
  yAxisLabel = 'Revenue (€)';
  timeline = false;

  colorScheme: string = 'cool';

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.updateStatistics();
    setTimeout(() => {
      this.isLoading = false;
      this.cdr.markForCheck();
    }, 100);
  }

  onPeriodChange(period: Period): void {
    this.selectedPeriod = period;
    this.updateStatistics();
    this.cdr.markForCheck();
  }

  getPeriodLabel(): string {
    switch (this.selectedPeriod) {
      case 'current':
        return 'Ce mois-ci';
      case 'last3':
        return '3 derniers mois';
      case 'last6':
        return '6 derniers mois';
      case 'year':
        return 'Cette année';
      default:
        return '';
    }
  }

  private updateStatistics(): void {
    const now = new Date();
    const currentMonth = now.getMonth();
    
    let filteredData: RevenueDataPoint[];
    
    switch (this.selectedPeriod) {
      case 'current':
        filteredData = this.fullStatistics.revenueAnalysis.slice(currentMonth, currentMonth + 1);
        break;
      case 'last3':
        filteredData = this.fullStatistics.revenueAnalysis.slice(Math.max(0, currentMonth - 2), currentMonth + 1);
        break;
      case 'last6':
        filteredData = this.fullStatistics.revenueAnalysis.slice(Math.max(0, currentMonth - 5), currentMonth + 1);
        break;
      case 'year':
        filteredData = this.fullStatistics.revenueAnalysis;
        break;
      default:
        filteredData = this.fullStatistics.revenueAnalysis;
    }

    // Update statistics with filtered data
    this.statistics = {
      ...this.fullStatistics,
      revenueAnalysis: filteredData
    };

    // Calculate current month statistics based on filtered data
    if (filteredData.length > 0) {
      const lastMonth = filteredData[filteredData.length - 1];
      this.statistics.currentMonth = {
        revenue: lastMonth.revenue,
        orderCount: lastMonth.orders,
        averageTicket: lastMonth.revenue / lastMonth.orders
      };
    }
  }

  // Get data for the chart
  get chartData() {
    return [
      {
        name: 'Revenue',
        series: this.statistics.revenueAnalysis.map(data => ({
          name: data.month,
          value: data.revenue
        }))
      },
      {
        name: 'Orders',
        series: this.statistics.revenueAnalysis.map(data => ({
          name: data.month,
          value: data.orders
        }))
      }
    ];
  }

  onSelect(event: any) {
    // Handle selection events
  }
} 