export type Owner = {
    id: number;
    name: string;
    email: string;
}

export type OwnerWithoutId = Omit<Owner, "id">;