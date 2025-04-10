export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    image?: string;
    menus: Menu[];
    articles: MenuItem[];
}

export interface Menu {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    items: MenuItem[];
}

export interface MenuItem {
    id: string;
    name: string;
    description?: string;
    price: number;
    image?: string;
    options?: MenuItemOption[];
}

export interface MenuItemOption {
    name: string;
    choices: string[];
    multiSelect: boolean;
    defaultChoice?: string;
} 