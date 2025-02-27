"use client";

import Link from "next/link";
import React, { useEffect } from "react";

// Store
import { fetchAllProducts, searchProducts } from "@/store/slices/productSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";

// Components
import Loading from "@/components/Loading/Loading";
import ProductRow from "@/components/Painel/Product/ProductRow";
import { Gender } from "@/core/models/enums/Gender";
import { fetchAllCategories } from "@/store/slices/categorySlice";
import { useFormik } from "formik";
import { FaSearch, FaUndo } from "react-icons/fa";
import { useDebounce } from "@/hooks/useDebounce";

const Produtos = () => {
  const [loading, setLoading] = React.useState(true);

  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.filteredProductsList);
  const categories = useAppSelector((state) => state.categories.categoryList);

  const formattGenderNames: Record<Gender, string> = {
    [Gender.AllGender]: "Todos",
    [Gender.Masculino]: "Masculino",
    [Gender.Feminino]: "Feminino",
    [Gender.Unissex]: "Unissex",
  };

  const gendersNewNames = Object.values(Gender).map((value) => ({
    value,
    name: formattGenderNames[value],
  }));

  const formik = useFormik({
    initialValues: {
      categoryId: 0,
      gender: gendersNewNames[0].value,
      isPromo: false,
      searchName: "",
    },
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      dispatch(
        searchProducts({
          categoryId: values.categoryId,
          gender: values.gender,
          isPromo: values.isPromo,
          name: values.searchName,
        })
      );
    },
  });

  const categoryDebounce = useDebounce(() => formik.values.categoryId, 500);
  const genderDebounce = useDebounce(() => formik.values.gender, 500);
  const isPromoDebounce = useDebounce(() => formik.values.isPromo, 500);
  const searchDebounce = useDebounce(() => formik.values.searchName, 1000);

  useEffect(() => {
    formik.handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryDebounce, genderDebounce, isPromoDebounce, searchDebounce]);

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      dispatch(fetchAllProducts());
      dispatch(fetchAllCategories());
      setLoading(false);
    };

    fetchProducts();
  }, [dispatch]);

  const handleReset = () => {
    formik.resetForm();
    dispatch(fetchAllProducts());
  };

  return (
    <section className="!w-full flex flex-col">
      <div className="max-[560px]:flex-col flex max-[860px]:items-center max-[860px]:justify-center max-[560px]:gap-5">
        <form className="w-full flex max-[980px]:flex-col justify-between max-[560px]:w-full max-[980px]:gap-5">
          <Link
            href={"/painel/produtos/novo"}
            className="mr-2 max-[980px]:text-2xl text-center !min-[981px]:text-md py-4 min-[981px]:py-2 px-6 max-[980px]:!w-full min-[981px]:w-fit btn-black"
          >
            Adicionar produto!
          </Link>
          <div className="flex max-[680px]:flex-col-reverse max-[680px]:gap-5 max-[980px]:w-full max-[980px]:justify-center max-[980px]:items-center">
            <div className="flex max-[420px]:flex-wrap max-[420px]:items-center max-[420px]:justify-center max-[420px]:gap-2">
              <div className="mx-2 flex max-[420px]:w-full max-[420px]:!m-0">
                <label className="txt-label" htmlFor="category">
                  Categoria
                </label>
                <select
                  name="categoryId"
                  id="categoryId"
                  value={formik.values.categoryId}
                  onChange={formik.handleChange}
                  className="txt-input bg-white p-3"
                >
                  <option value="0">Todas</option>
                  {categories.map((el, index) => (
                    <option key={index} value={el.id}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mx-2 flex max-[420px]:w-full max-[420px]:!m-0">
                <label className="txt-label" htmlFor="category">
                  Gênero
                </label>
                <select
                  name="gender"
                  id="gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  className="txt-input bg-white p-3"
                >
                  {gendersNewNames.map((el, index) => (
                    <option key={index} value={el.value}>
                      {el.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mx-2 flex gap-2 items-center max-[420px]:w-full max-[420px]:justify-center max-[420px]:!m-0">
                <label htmlFor="isPromo">Com promoção? </label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={formik.values.isPromo}
                  onChange={formik.handleChange}
                  name="isPromo"
                  id="isPromo"
                />
              </div>
            </div>
            <div className="mx-2 flex max-[680px]:w-full">
              <label htmlFor="search" className="txt-label">
                Pesquisar produto
              </label>
              <input
                type="text"
                name="searchName"
                id="searchName"
                value={formik.values.searchName}
                onChange={formik.handleChange}
                className="txt-input rounded-tr-none border-r-0 rounded-br-none"
              />
              <span className="px-2 text-center text-gray-500 py-3 border border-l-0">
                <FaSearch className="mx-1" />
              </span>
              <button
                title="Recarregar tabela"
                type="button"
                className="btn-black px-2 rounded-tl-none rounded-bl-none"
                onClick={handleReset}
              >
                <FaUndo className="mx-1" />
              </button>
            </div>
          </div>
        </form>
      </div>
      <hr className="my-3" />
      <h3 className="text-gray-700 mt-5 font-oswald">Produtos Cadastrados: {products.length}</h3>

      {loading ? (
        <div className="flex flex-col h-[322px] text-center items-center justify-center">
          <h4 className="">Carregando...</h4>
          <Loading size={50} color="#3498db" />
        </div>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full my-5 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase  bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Imagem
                </th>
                <th scope="col" className="px-6 py-3">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3">
                  Categoria
                </th>
                <th scope="col" className="px-6 py-3">
                  Gênero
                </th>
                <th scope="col" className="px-6 py-3">
                  Preço
                </th>
                <th scope="col" className="px-6 py-3">
                  Preço da oferta
                </th>
                <th scope="col" className="px-6 py-3">
                  Adicionado em
                </th>
                <th scope="col" className="px-6 py-3">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {products?.map((el, index) => (
                <ProductRow key={index} dto={el} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Produtos;
