export interface Restaurant {
    id: string;
    name: string;
    location: string;
    description: string;
    image: string;
    deliveryFee?: number;
    freeDelivery?: boolean;
    menus: Menu[];
    articles: MenuItem[];
}

export interface Menu {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    items: any[];
}

export interface MenuItem {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    options?: {
        name: string;
        choices: string[];
        multiSelect: boolean;
        defaultChoice: string;
    }[];
}

export interface MenuItemOption {
    name: string;
    choices: string[];
    multiSelect: boolean;
    defaultChoice?: string;
} 