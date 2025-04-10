import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [
        CommonModule,
        OrderDetailsComponent,
        OrderHistoryComponent
    ],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {} 