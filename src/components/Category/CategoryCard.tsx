"use client";

import { useState } from "react";

// Models
import { Category } from "@/core/models/Category";

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

function CategoryCard({ category }: { category: Category }) {
  // Abrir e fechar mensagem para deletar
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categorieToDelete, setCategorieToDelete] = useState<Category | null>(
    null
  );
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    if (!categorieToDelete) return;

    const deleteProduct = async (id: number) => {
      await fetch(`http://localhost:3000/api/products/${id}`, {
        method: "DELETE",
      });
    };

    setIsDeleted(true);
    try {
      await deleteProduct(categorieToDelete.id as number);
      alert(
        `A categoria "${categorieToDelete.name}" foi deletadoa com sucesso.`
      );
    } catch (error) {
      console.error("Erro ao deletar a categoria:", error);
      alert("Não foi possível deletar a categoria. Tente novamente.");
    }
  };
  return (
    <div className="rounded shadow flex flex-row transition-all hover:-translate-y-1 cursor-pointer">
      {isDialogOpen && categorieToDelete && !isDeleted && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent
            className="max-[640px]:max-w-[425px]"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle className="max-[480px]:text-sm">
                Você tem certeza que deseja deletar a categoria{" "}
                {categorieToDelete.name}
              </DialogTitle>
            </DialogHeader>
            <div className="w-full flex justify-end gap-5 max-[640px]:justify-center">
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Deletar
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDialogOpen(false);
                }}
              >
                Voltar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div
        className="h-full p-7  rounded-tl rounded-bl"
        style={{
          backgroundColor: category.color,
        }}
      ></div>
      <div className="flex p-3 items-center justify-between w-full">
        <h3 className="text-xl font-semibold text-gray-700">{category.name}</h3>
        <i
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            setIsDialogOpen(true);
            setCategorieToDelete(category);
          }}
          className="cursor-pointer text-red-400 hover:text-red-600 !z-10"
        >
          <FaTrashCan size={20} />
        </i>
      </div>
    </div>
  );
}

export default CategoryCard;
