import { Category } from "../models/Category";
import { insertData, selectAll, updateData } from "./dbService";

const columnName: string = "categories";

export async function getAllCategories(): Promise<Category[] | null> {
  return await selectAll<Category>({
    table: "categories",
  });
}

export async function createCategory(cat: Category): Promise<Category | null> {
  return await insertData<Category>(cat, columnName);
}

export async function updateCategory(cat: Category): Promise<Category | null> {
  return await updateData<Category>(cat, columnName);
}
