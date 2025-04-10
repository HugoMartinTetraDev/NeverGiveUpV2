export interface RestaurateurItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
}

export interface RestaurateurMenu {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    items: string[]; // Array of item IDs
} 