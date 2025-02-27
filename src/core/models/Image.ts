import { ImageType } from "./enums/ImageType";

export interface Image{
  id: string,
  url: string,
  type: ImageType
  productId: number;
  created_at?: string;
  updated_at?: string;
}