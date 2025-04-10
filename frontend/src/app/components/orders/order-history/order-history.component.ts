import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { OrderHistory } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';

@Component({
    selector: 'app-order-history',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatButtonModule,
        RouterModule
    ],
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
    orderHistory: OrderHistory[] = [];
    displayedColumns: string[] = ['id', 'dateTime', 'amount', 'paymentType', 'action'];

    constructor(private orderService: OrderService) {}

    ngOnInit() {
        this.loadOrderHistory();
    }

    loadOrderHistory() {
        this.orderService.getOrderHistory().subscribe(history => {
            this.orderHistory = history;
        });
    }
} 