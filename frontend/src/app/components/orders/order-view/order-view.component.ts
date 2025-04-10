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
        // Récupérer l'ID de la commande depuis la route
        this.route.paramMap.subscribe(params => {
            const orderId = params.get('id');
            if (orderId) {
                this.loadOrder(orderId);
            }
        });
    }

    loadOrder(orderId: string) {
        this.orderService.getOrderById(orderId).subscribe(order => {
            this.order = order;
        });
    }
} 