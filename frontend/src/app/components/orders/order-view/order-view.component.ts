import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { Order } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-view',
    standalone: true,
    imports: [
        CommonModule,
        MatDividerModule
    ],
    templateUrl: './order-view.component.html',
    styleUrls: ['./order-view.component.scss']
})
export class OrderViewComponent implements OnInit {
    order: Order | null = null;

    constructor(
        private orderService: OrderService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // In a real application, we would get the order ID from the route
        // and fetch the specific order. For now, we'll use the mock data.
        this.orderService.getCurrentOrder().subscribe(order => {
            this.order = order;
        });
    }
} 