import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { Observable } from 'rxjs';

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
export class OrdersComponent implements OnInit {
    currentOrder$: Observable<Order | null>;

    constructor(private orderService: OrderService) {
        this.currentOrder$ = this.orderService.currentOrder$;
    }

    ngOnInit() {
        // Load mock orders if needed
        this.orderService.getMockOrders().subscribe();
    }
} 