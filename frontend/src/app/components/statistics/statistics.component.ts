import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Statistics, RevenueDataPoint } from '../../models/statistics.model';

type Period = 'current' | 'last3';

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
      revenue: 45678.90,
      orderCount: 1523,
      averageTicket: 30.00
    },
    revenueAnalysis: [
      { month: 'Jan', revenue: 42000, orders: 1400 },  // Post-holiday season
      { month: 'Feb', revenue: 45000, orders: 1500 },  // Valentine's Day boost
      { month: 'Mar', revenue: 48000, orders: 1600 },  // Spring season
      { month: 'Apr', revenue: 46000, orders: 1533 },  // Easter period
      { month: 'May', revenue: 50000, orders: 1667 },  // Start of summer
      { month: 'Jun', revenue: 52000, orders: 1733 },  // Summer season
      { month: 'Jul', revenue: 54000, orders: 1800 },  // Peak summer
      { month: 'Aug', revenue: 53000, orders: 1767 },  // Summer vacation
      { month: 'Sep', revenue: 51000, orders: 1700 },  // Back to school
      { month: 'Oct', revenue: 49000, orders: 1633 },  // Autumn season
      { month: 'Nov', revenue: 55000, orders: 1833 },  // Pre-holiday season
      { month: 'Dec', revenue: 60000, orders: 2000 }   // Holiday season
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
      default:
        filteredData = this.fullStatistics.revenueAnalysis.slice(currentMonth, currentMonth + 1);
    }

    // Calculate total revenue and orders for the selected period
    const totalRevenue = filteredData.reduce((sum, data) => sum + data.revenue, 0);
    const totalOrders = filteredData.reduce((sum, data) => sum + data.orders, 0);
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Update statistics with filtered data and calculated values
    this.statistics = {
      currentMonth: {
        revenue: totalRevenue,
        orderCount: totalOrders,
        averageTicket: averageTicket
      },
      revenueAnalysis: filteredData
    };
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