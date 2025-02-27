import { supabase } from "@/lib/supabase";
import { Product } from "../models/Product";
import { Gender } from "../models/enums/Gender";
import { deleteData, getUserId, insertData, selectAll, updateData } from "./dbService";
import { ProductDTO } from "../models/DTOs/ProductDTO";
import { loadAllImages, loadProfileImage } from "./bucketService";
import { ImageType } from "../models/enums/ImageType";

const tableName: string = "products";

//Método para retornar todos os ProductDTO dado uma lista de Product
//Este método foi implementado internamente para reuso, tendo em vista que será
//utilizado várias vezes
async function getAllDtos(dbProducts: Product[]): Promise<ProductDTO[] | null> {
  const products: ProductDTO[] = [];

  if (!dbProducts) return null;

  const images = await loadAllImages();
  for (const p of dbProducts) {
    const profileImage = images?.find(
      (prod) => prod.productId === p!.id && prod.type === ImageType.Profile
    );

    products.push({
      product: p,
      profileImage: profileImage!,
      images: images!.filter((prod) => prod.productId === p!.id && prod.type === ImageType.Normal),
    });
  }

  return products;
}

//Retorna todos os produtos do db sem filtros
export async function getAllProducts(): Promise<ProductDTO[] | null> {
  const dbProducts = await selectAll<Product>({
    table: "products",
    refTable: "*, category:categories(*)",
  });

  return await getAllDtos(dbProducts!);
}

export async function searchProducts(search: string): Promise<ProductDTO[] | null> {
  const query = supabase
    .from(tableName)
    .select("*, category:categories(*)")
    .eq("userId", await getUserId())
    .like("name", `%${search}%`);

  const { data, error } = await query.returns<ProductDTO[]>();

  if (error) console.error("Erro em searchProducts:", error);
  return data;
}

export async function createProduct(product: Product): Promise<Product | null> {
  return await insertData<Product>(product, tableName);
}

export async function updateProduct(product: Product): Promise<Product | null> {
  return await updateData<Product>(product, tableName);
}

export async function getProduct(id: number): Promise<ProductDTO | null> {
  console.log("🔍 Buscando produto com ID:", id);

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", id)
    .maybeSingle(); // <- Evita erro se mais de um produto for encontrado

  if (error) {
    console.error("❌ Erro no Supabase:", error);
  }

  const profileImage = await loadProfileImage(data.id!);
  const images = await loadAllImages().then((res) =>
    res?.filter((prod) => prod.productId === data.id! && prod.type === ImageType.Normal)
  );
  const productDto: ProductDTO = {
    product: data,
    profileImage: profileImage!,
    images: images!,
  };

  console.log(productDto);

  console.log("📦 Produto encontrado:", data);
  return productDto;
}

export async function getAllProductByPromo(): Promise<ProductDTO[] | null> {
  const dbProducts = await selectAll<Product>({
    table: "products",
    refTable: "*, category:categories(*)",
    where: { column: "isPromo", value: true }, // Filtrar por produtos em promoção
  });

  return await getAllDtos(dbProducts!);
}

export async function getProductsByCategoryAndGender(
  categoryId: number,
  gender: Gender = Gender.AllGender
): Promise<ProductDTO[] | null> {
  const query = supabase.from("products").select("*, category:categories(*)");

  if (gender !== "allGender") {
    query.eq("gender", gender.toString());
  }
  // Verifique se categoryId é válido antes de aplicar o filtro
  if (categoryId && categoryId !== 0) {
    query.eq("categoryId", categoryId);
  }

  const { data, error } = await query.returns<Product[]>();

  if (error) {
    console.error("Erro ao buscar produtos:", error);
    return null;
  }

  return await getAllDtos(data)
}

export async function deleteProductAsync(id: number): Promise<ProductDTO | null> {
  return await deleteData<ProductDTO>(id, tableName);
}
