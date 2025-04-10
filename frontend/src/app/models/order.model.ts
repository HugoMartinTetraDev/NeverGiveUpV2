export interface OrderItem {
    quantity: number;
    name: string;
    price: number;
    image: string;
}

export interface Order {
    id: string;
    date: Date;
    items: OrderItem[];
    subtotal: number;
    fees: {
        amount: number;
        percentage: number;
    };
    total: number;
    status: OrderStatus[];
}

export interface OrderStatus {
    timestamp: string;
    status: string;
}

export interface OrderHistory {
    id: number;
    dateTime: Date;
    amount: number;
    paymentType: string;
} 