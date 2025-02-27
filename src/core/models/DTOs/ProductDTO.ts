import { Image } from "../Image";
import { Product } from "../Product";

export interface ProductDTO{
  product: Product,
  profileImage: Image
  images: Image[] | null
}