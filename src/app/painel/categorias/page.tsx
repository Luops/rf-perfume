"use client";

import { useFormik } from "formik";
import React, { useEffect } from "react";

// Store
import { addCategory, fetchAllCategories } from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

// Components
import Loading from "@/components/Loading/Loading";
import CategoryCard from "@/components/Category/CategoryCard";

const Categorias = () => {
  const [loading, setLoading] = React.useState(true);

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categoryList);
  // const navigator = useRouter();

  // Função para normalizar o nome da categoria. Ex: "Camisa Masculina" para "camisa_masculina"
  const normalizeCategoryName = (name: string): string => {
    return name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover marcas de acento
      .replace(/\s+/g, "_") // Substituir espaços por "_"
      .toLowerCase(); // Converter para letras minúsculas
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      color: "#000000",
      value: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const normalizedName = normalizeCategoryName(values.name);
      console.log("Submitting category:", {
        name: values.name,
        color: values.color,
        value: normalizedName,
      });

      if (!values.name || !values.color || !normalizedName) {
        console.error("Form validation failed: Missing required fields.");
        return;
      }
      dispatch(
        addCategory({
          name: values.name,
          color: values.color,
          value: normalizedName,
        })
      )
        .then(() => {
          console.log("Category added successfully");
          dispatch(fetchAllCategories());
        })
        .catch((error) => {
          console.error("Failed to add category:", error);
        });
    },
  });

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      dispatch(fetchAllCategories());
      setLoading(false);
    };
    fetchCategories();
  }, [dispatch]);
  return (
    <div className="flex flex-col">
      <p className="font-oswald text-gray-500 max-[560px]:text-center">Escreva abaixo o nome da categoria que deseja e clique em criar.</p>
      <form className="w-full flex max-[560px]:flex-col flex-row max-[560px]:gap-3 mt-3">
        <div className="flex">
          <label htmlFor="name" className="txt-label">
            Nome da categoria
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="txt-input"
            value={formik.values.name}
            onChange={formik.handleChange}
          />
          <input
            type="color"
            name="color"
            id="color"
            className="border rouded-full mx-3 max-[560px]:h-[50px] h-full"
            value={formik.values.color}
            onChange={formik.handleChange}
          />
        </div>
        <button
          type="button"
          onClick={() => formik.handleSubmit()}
          className="max-[560px]:text-2xl !min-[561px]:text-md btn-primary max-[560px]:mx-0 mx-3 btn-black"
        >
          Criar categoria!
        </button>
      </form>
      <hr className="my-3" />

      {loading ? (
        <div className="flex flex-col h-[322px] text-center items-center justify-center">
          <h4 className="">Carregando...</h4>
          <Loading size={50} color="#3498db" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories?.map((el, index) => (
            <div key={index}>
              <CategoryCard category={el} key={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categorias;
