import { BaseEntity } from "./BaseEntity";
import { Category } from "./Category";

export interface Product extends BaseEntity {
  name: string;
  id?: number | undefined;
  categoryId: number;
  category?: Category;
  isPromo: boolean;
  promoPrice?: number;
  quantity: number;
  price: number;
  description: string;
  gender: string;
}
