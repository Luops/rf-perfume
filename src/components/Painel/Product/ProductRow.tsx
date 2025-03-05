"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Models
import { ProductDTO } from "@/core/models/DTOs/ProductDTO";
import { Gender } from "@/core/models/enums/Gender";

// Shadcn
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Icons
import { FaTrashCan } from "react-icons/fa6";
import { useAppDispatch } from "@/store/store";
import { deleteProduct } from "@/store/slices/productSlice";

function ProductRow(props: { dto: ProductDTO }) {
  const dispatch = useAppDispatch();
  const navigator = useRouter();

  // Estado para armazenar o produto a ser deletado
  const [productToDelete, setProductToDelete] = useState<ProductDTO | null>(
    null
  );

  const handleClick = () => {
    navigator.replace(`/painel/produtos/editar/${props.dto.product.id}`);
  };

  const getGenderName = (gender: string | null | undefined) => {
    const genderMap: Record<string, string> = {
      [Gender.Masculino]: "MASCULINO",
      [Gender.Feminino]: "FEMININO",
      [Gender.Unissex]: "UNISSEX",
      [Gender.AllGender]: "Todos",
    };

    return gender ? genderMap[gender] || "Desconhecido" : "Desconhecido";
  };

  // Deletar produto
  const handleDelete = async () => {
    if (!productToDelete) return;

    dispatch(deleteProduct({ id: productToDelete.product.id! }));
    setProductToDelete(null); // Fecha o diálogo após deletar
    navigator.replace("/painel/produtos");
  };

  return (
    <>
      {/* Diálogo de confirmação de exclusão */}
      <Dialog
        open={!!productToDelete}
        onOpenChange={() => setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Você tem certeza que deseja deletar o produto{" "}
              {productToDelete?.product.name}?
            </DialogTitle>
          </DialogHeader>
          <div className="w-full flex justify-end gap-5">
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Deletar
            </Button>
            <Button onClick={() => setProductToDelete(null)}>Voltar</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Linha da tabela */}
      <tr
        onClick={handleClick}
        className="bg-white border-b transition-all hover:bg-gray-100 cursor-pointer dark:bg-gray-800 dark:border-gray-700 border-gray-200"
      >
        <th className="max-[560px]:w-[100px] py-3 pl-3 w-[120px]">
          <Image
            width={0}
            height={0}
            className="w-full h-auto object-cover rounded border shadow aspect-square"
            quality={100}
            unoptimized={true}
            src={
              props.dto.profileImage.url ||
              "https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png"
            }
            alt={props.dto.product.name}
          />
        </th>
        <td className="pl-6 font-bold max-[560px]:text-xs text-md">
          {props.dto.product.name}
        </td>
        <td className="pl-6 max-[560px]:text-xs text-md">
          {props.dto.product.category?.name}
        </td>
        <td className="pl-6 max-[560px]:text-xs text-md">
          {getGenderName(props.dto.product.gender)}
        </td>
        <td className="pl-6 text-emerald-500 max-[560px]:text-xs text-md">
          R${props.dto.product.price.toFixed(2)}
        </td>
        <td className="pl-6 text-orange-500 max-[560px]:text-xs text-md">
          {props.dto.product.promoPrice
            ? `R$${props.dto.product.promoPrice?.toFixed(2)}`
            : "N/A"}
        </td>
        <td className="pl-6 max-[560px]:text-xs text-md">
          {new Date(props.dto.product.created_at!).toLocaleString()}
        </td>
        <td className="pl-6 max-[560px]:text-xs text-md">
          <i
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation(); // Evita que o clique se propague para a <tr>
              setProductToDelete(props.dto);
            }}
            className="flex cursor-pointer text-red-400 hover:text-red-600 !z-10"
          >
            <FaTrashCan size={20} />
          </i>
        </td>
      </tr>
    </>
  );
}

export default ProductRow;
