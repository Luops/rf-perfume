import { v4 as uuidv4 } from "uuid";
import { getSession } from "./dbService";
import { supabase } from "@/lib/supabase";
import { ImageType } from "../models/enums/ImageType";
import { Image } from "../models/Image";

export async function uploadProfileImage(file: File, productId: number): Promise<boolean | string> {
  await upload(file, productId, ImageType.Profile);
  return true;
}

export async function uploadImages(files: File[], productId: number): Promise<boolean | string> {
  files.forEach(async (file) => {
    await upload(file, productId, ImageType.Normal);
  });
  return true;
}

export async function deleteImages(pictureIds: string[]): Promise<boolean | null> {
  await supabase.from('pictures').delete().in('id', pictureIds).then((res) => {
    if(res.error){
      return false;
    }
    supabase.storage.from('moon-bucket').remove(pictureIds);
  })
  return true;
}

async function upload(file: File, productId: number, type: ImageType): Promise<boolean | string> {
  const uuid = uuidv4();
  await supabase.storage
    .from("moon-bucket")
    .upload(`/products/${uuid}`, file)
    .then(async (res) => {
      await supabase.from("pictures").insert({
        id: uuid,
        productId: productId,
        userId: (await getSession()).data.session?.user.id,
        type: type,
      });

      if (res.error) {
        return res.error;
      }
    });
  return true;
}

export async function updateProfileImage(
  file: File,
  productId: number,
  pictureId?: string
): Promise<boolean | string> {
  const storage = supabase.storage.from("moon-bucket");
  const hasValue = await hasProfilePicture(productId);
  if (hasValue) {
    await storage.update(`/products/${pictureId}`, file).then(async (res) => {
      await supabase
        .from("pictures")
        .delete()
        .eq("productId", productId)
        .eq("type", ImageType.Profile)
        .then(async () => {
          await upload(file, productId, ImageType.Profile);
        });

      if (res.error) {
        return res.error;
      }
    });
  } else {
    console.log("new!");
    await upload(file, productId, ImageType.Profile);
  }
  return true;
}

async function hasProfilePicture(productId: number): Promise<boolean | null> {
  return await supabase
    .from("pictures")
    .select("productId", { count: "exact", head: true })
    .eq("productId", productId)
    .eq("type", ImageType.Profile)
    .then((res) => {
      if (res.count! > 0) {
        return true;
      }
      return false;
    });
}

export function loadImageUrl(pictureId: string): string {
  return `https://ieuyxhqdvesyzcwoppcm.supabase.co/storage/v1/object/public/moon-bucket/products/${pictureId}`;
}

export async function loadProfileImage(productId: number): Promise<Image | null> {
  const picture = (
    await supabase
      .from("pictures")
      .select("id, productId, created_at")
      .eq("productId", productId)
      .eq("type", ImageType.Profile)
      .single()
  ).data;

  const image: Image = {
    id: picture?.id,
    type: ImageType.Profile,
    url: loadImageUrl(picture?.id),
    productId: picture?.productId as number,
    created_at: picture?.created_at,
  };

  return image;
}

export async function loadAllImages(): Promise<Image[] | null> {
  const pictureIds = (
    await supabase.from("pictures").select("id, productId, created_at, type")
  ).data;
  const pictures: Image[] = [];

  pictureIds?.map((p) => {
    pictures.push({
      id: p.id,
      type: p.type,
      url: loadImageUrl(p.id),
      productId: p.productId,
      created_at: p.created_at,
    });
  });

  return pictures;
}
