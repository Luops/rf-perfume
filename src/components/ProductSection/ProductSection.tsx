import React from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";

// Slice
import { fetchAllProducts } from "@/store/slices/productSlice";
import { fetchAllCategories } from "@/store/slices/categorySlice";
import { fetchAllProductsByCategoryAndGender } from "@/store/slices/productSlice";

// Enum
import { Gender } from "@/core/models/enums/Gender";

// Components
import ProductFiltred from "../ProductsComponent/ProductFiltred";
import Loading from "../Loading/Loading";

//Shadcn
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../app/globals.css";

// import required modules
import { Navigation } from "swiper/modules";

function ProductSection() {
  const [loading, setLoading] = React.useState(true);

  // Coletar as informacoes de genero e categoria
  const [selectedGender, setSelectedGender] =
    React.useState<string>("allGender");
  const [selectedCategory, setSelectedCategory] = React.useState<number>(0);
  const [appliedFilters, setAppliedFilters] = React.useState<
    { type: string; value: string }[]
  >([]);

  // Produtos
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.productList) || [];

  React.useEffect(() => {
    dispatch(fetchAllProducts());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Produtos filtrados
  React.useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      const data = {
        categoryId: selectedCategory || 0, // Garantir que seja um número
        gender:
          selectedGender === "allGender"
            ? Gender.AllGender
            : (selectedGender as Gender), // Converta para o tipo correto
      };
      console.log("Enviando filtros:", data);
      await dispatch(fetchAllProductsByCategoryAndGender(data));
      setLoading(false);
    };

    // Atualize a lógica para buscar todos os produtos, mesmo que o gênero seja 'allGender'
    fetchFilteredProducts();
  }, [dispatch, selectedGender, selectedCategory]);

  // Filtro de genero
  const handleGenderChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as Gender; // Cast para o tipo Gender
    setSelectedGender(value);

    if (value === Gender.AllGender) {
      removeFilter("gender");
    } else {
      updateFilters("gender", value);
    }
  };
  const categories = useAppSelector((state) => state.categories.categoryList);
  console.log("Categorias: ", categories);

  // Filtro de categoria
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value =
      event.target.value === "allCategory" ? 0 : Number(event.target.value);
    setSelectedCategory(value);

    // Atualizar filtros aplicados
    if (value === 0) {
      removeFilter("category");
    } else {
      const selectedCategory = categories.find(
        (category) => category.id === value
      );
      updateFilters("category", selectedCategory?.name || "Desconhecido");
    }
  };

  // Atualiza os filtros aplicados, removendo duplicatas e substituindo valores
  const updateFilters = (type: string, value: string) => {
    setAppliedFilters((prevFilters) => {
      const existingFilterIndex = prevFilters.findIndex(
        (filter) => filter.type === type
      );
      if (existingFilterIndex !== -1) {
        // Atualizar o filtro existente
        const updatedFilters = [...prevFilters];
        updatedFilters[existingFilterIndex] = { type, value };
        return updatedFilters;
      }
      // Adicionar novo filtro
      return [...prevFilters, { type, value }];
    });
  };

  // Remove um filtro individualmente
  const removeFilter = (type: string) => {
    setAppliedFilters((prevFilters) =>
      prevFilters.filter((filter) => filter.type !== type)
    );

    // Atualizar os estados correspondentes
    if (type === "gender") {
      setSelectedGender("allGender");
    } else if (type === "category") {
      setSelectedCategory(0);
    }
  };

  //Abrir ou fechar o accordion
  const [openAccordion, setOpenAccordion] = React.useState<string | null>(null);
  const handleAccordionToggle = (value: string | null) => {
    setOpenAccordion((prev) => (prev === value ? null : value));
  };
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".accordion-item")) {
      setOpenAccordion(null);
    }
  };
  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Estado para controlar a quantidade de produtos visíveis
  const [visibleCount, setVisibleCount] = React.useState(8); // Mostrar 8 produtos inicialmente

  // Função para carregar mais produtos
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 8); // Aumentar em 8 produtos a cada clique
  };

  // Função para carregar menos produtos e deixar somente 8
  const handleLoadLess = () => {
    if (visibleCount > 8) {
      setVisibleCount(8);
    }
  };

  return (
    <section className="w-full max-[480px]:px-2 max-[860px]:px-4 px-12 relative">
      <form
        action=""
        className="w-full flex gap-5 border-b border-[#f2f2f2] relative"
      >
        <Accordion
          type="single"
          collapsible
          className="accordion-item"
          value={openAccordion === "gender" ? "gender" : ""}
          onValueChange={(value) =>
            handleAccordionToggle(value === "gender" ? "gender" : null)
          }
        >
          <AccordionItem
            value="gender"
            className="!border-b-0 font-oswald tracking-widest"
          >
            <AccordionTrigger className="uppercase text-lg font-semibold">
              Gênero
            </AccordionTrigger>
            <AccordionContent className="flex flex-wrap gap-5 absolute z-50 bg-white shadow-md border border-gray-300 p-2">
              <label htmlFor="allGender" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="allGender"
                  value="allGender"
                  checked={selectedGender === "allGender"}
                  onChange={handleGenderChange}
                  className="custom-radio"
                />
                <span className="text-[1rem]">Todos</span>
              </label>
              <label htmlFor="masculino" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="masculino"
                  value="masculino"
                  checked={selectedGender === "masculino"}
                  onChange={handleGenderChange}
                  className="custom-radio"
                />
                <span className="text-[1rem]">Masculino</span>
              </label>
              <label htmlFor="feminino" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="feminino"
                  value="feminino"
                  checked={selectedGender === "feminino"}
                  onChange={handleGenderChange}
                  className="custom-radio"
                />
                <span className="text-[1rem]">Feminino</span>
              </label>
              <label htmlFor="unissex" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  id="unissex"
                  value="unissex"
                  checked={selectedGender === "unissex"}
                  onChange={handleGenderChange}
                  className="custom-radio"
                />
                <span className="text-[1rem]">Unissex</span>
              </label>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion
          type="single"
          collapsible
          className="accordion-item"
          value={openAccordion === "category" ? "category" : ""}
          onValueChange={(value) =>
            handleAccordionToggle(value === "category" ? "category" : null)
          }
        >
          <AccordionItem
            value="category"
            className="!border-b-0 font-oswald tracking-widest"
          >
            <AccordionTrigger className="uppercase text-lg font-semibold">
              Categoria
            </AccordionTrigger>
            <AccordionContent className="flex flex-wrap gap-5 absolute z-50 bg-white shadow-md border border-gray-300 p-2">
              <label htmlFor="allCategory" className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  id="allCategory"
                  value="allCategory"
                  checked={selectedCategory == 0}
                  onChange={handleCategoryChange}
                  className="custom-radio"
                />
                <span className="text-[1rem]">Todos</span>
              </label>
              {categories.map((category) => (
                <label
                  key={category.id}
                  htmlFor={`category-${category.id}`}
                  className="flex items-center gap-2"
                >
                  <input
                    type="radio"
                    name="category"
                    id={`category-${category.id}`}
                    value={category.id}
                    checked={selectedCategory === category.id}
                    onChange={handleCategoryChange}
                    className="custom-radio"
                  />
                  <span className="text-[1rem]">{category.name}</span>
                </label>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </form>
      {/* Div de filtros aplicados */}
      <div className="mt-4 flex gap-3 flex-wrap">
        {appliedFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full"
          >
            <span className="text-sm font-semibold font-oswald tracking-[1px]">
              {filter.value}
            </span>
            <button
              type="button"
              onClick={() => removeFilter(filter.type)}
              className="text-red-500 hover:text-red-700"
            >
              x
            </button>
          </div>
        ))}
      </div>
      {/* Produtos */}
      {loading ? (
        <div className="flex flex-col h-[400px] text-center items-center justify-center">
          <h4 className="">Carregando...</h4>
          <Loading size={50} color="#3498db" />
        </div>
      ) : (
        <div className="!w-full flex">
          {products && products.length > 0 ? (
            <div className="w-full flex flex-col">
              {/* Versão Desktop */}
              <div className="hidden min-[1028px]:flex flex-wrap items-center justify-center gap-4">
                {products.slice(0, visibleCount).map((product) => (
                  <li key={product.product.id} className="list-none">
                    <ProductFiltred dto={product} />
                  </li>
                ))}
              </div>
              {/* Botão "Ver mais" aparece se ainda houver produtos a serem mostrados */}
              {visibleCount < products.length && (
                <div className="hidden min-[1028px]:flex justify-center mt-4 font-oswald tracking-wider">
                  <Button
                    onClick={handleLoadMore}
                    className=" text-white px-4 py-2 rounded-md  transition"
                  >
                    Ver mais
                  </Button>
                </div>
              )}
              {visibleCount > 8 && (
                <div className="hidden min-[1028px]:flex justify-center mt-4 font-oswald tracking-wider">
                  <Button
                    onClick={handleLoadLess}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                  >
                    Ver menos
                  </Button>
                </div>
              )}
              <div className="flex min-[1028px]:hidden">
                <Swiper
                  spaceBetween={30}
                  pagination={{ clickable: true }}
                  navigation={true}
                  modules={[Navigation]}
                  breakpoints={{
                    320: {
                      slidesPerView: 1,
                      spaceBetween: 10,
                    },
                    361: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                    480: {
                      slidesPerView: 2,
                      spaceBetween: 10,
                    },
                    690: {
                      slidesPerView: 3,
                      spaceBetween: 15,
                    },
                    1024: {
                      slidesPerView: 4,
                      spaceBetween: 30,
                    },
                  }}
                  className="mySwiper w-full"
                >
                  {products.map((product) => (
                    <SwiperSlide key={product.product.id}>
                      <ProductFiltred dto={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          ) : (
            <h3 className="text-gray-500">Nenhum produto encontrado.</h3>
          )}
        </div>
      )}
    </section>
  );
}

export default ProductSection;
