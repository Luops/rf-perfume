import { BaseEntity } from "../models/BaseEntity";
import { supabase } from "@/lib/supabase";

//Métodos para autenticação---------------------------------------
export async function signUp(data: { email: string; password: string }) {
  return await supabase.auth.signUp(data);
}

export async function signIn(data: { email: string; password: string }) {
  return await supabase.auth.signInWithPassword(data);
}

export async function getSession() {
  return await supabase.auth.getSession();
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function getUser(jwt: string | undefined) {
  return supabase.auth.getUser(jwt);
}

//Método para retornar o UUID do usuário atual que está autenticado
export async function getUserId(): Promise<string> {
  return (await supabase.auth.getUser()).data.user!.id;
}

//---------------------------------------------------------------------

//Retorna todas as entidades no banco dado o tipo parametrizado
export async function selectAll<TEntity>({
  table,
  refTable = "*",
  where,
}: {
  table: string;
  refTable?: string;
  where?: { column: string; value: boolean }; // Novo parâmetro para filtro
}): Promise<TEntity[] | null> {
  //const userId = await getUserId();

  let query = supabase.from(table).select(refTable);

  // Adicionar condição do where, se fornecida
  if (where) {
    query = query.eq(where.column, where.value);
  }

  const { data, error } = await query.returns<TEntity[]>();
  if (error) console.error("Erro no selectAll:", error);
  return data;
}

//Insere a entidade parametrizada no banco
export async function insertData<TEntity>(
  entity: BaseEntity,
  table: string
): Promise<TEntity | null> {
  entity.userId = await getUserId();
  return (await supabase.from(table).insert(entity).select().single()).data;
}

export async function updateData<TEntity>(
  entity: BaseEntity,
  table: string
): Promise<TEntity | null> {
  entity.userId = await getUserId();
  return (await supabase.from(table).update(entity).eq("id", entity.id).select().single()).data;
}

export async function selectData<TEntity>({
  table,
  id,
  refTable = "*",
}: {
  table: string;
  id: string;
  refTable?: string;
}): Promise<TEntity | null> {
  return (
    await supabase
      .from(table)
      .select(refTable)
      .eq("id", id)
      .eq("userId", await getUserId())
      .select()
      .single()
  ).data;
}

export async function deleteData<TEntity>(
  id: string | number,
  table: string,
): Promise<TEntity | null> {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .select()
    .returns<TEntity>();

  if (error) console.error("Erro no delete:", error);
  return data;
}
