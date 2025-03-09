/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import ImageContainer from "@/components/ImageContainer/ImageContainer";
import Loading from "@/components/Loading/Loading";
import ProfileUploadContainer from "@/components/UploadContainer/ProfileUploadContainer";
import { Product } from "@/core/models/Product";
import { updateProfileImage } from "@/core/services/bucketService";
import { updateProduct } from "@/core/services/productService";
import { fetchAllCategories } from "@/store/slices/categorySlice";
import { fetchProductById } from "@/store/slices/productSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { useLayoutEffect, useEffect, useState } from "react";
import * as Yup from "yup";

function ProdutoPage() {
  const navigator = useRouter();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categoryList);

  //Pega o parametro 'productId' da URL
  const params = useParams<{ productId: string }>();

  //Produto concreto vindo do banco de dados atraves da redux store
  const profileImage = useAppSelector(
    (state) => state.products.dto.profileImage
  );
  const dbProduct = useAppSelector((state) => state.products.dto.product);

  //Arquivo de imagem
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  //Função passada para o componente UpdateComponent
  const handleProfileImage = (file: File) => {
    setNewProfileImage(file);
  };

  //Ao carregar a página e carregado em conjunto todas as categorias, produtos e
  //o produto referenciado na URL
  useLayoutEffect(() => {
    dispatch(fetchProductById(parseInt(params.productId!)));
    dispatch(fetchAllCategories());
    console.log(dbProduct);
  }, [dispatch]);

  // const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    console.log("Id do produto:" + params.productId);
    // loadImage(parseInt(params.productId!)).then((res) => setImageUrl(res!));
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  //Guarda um valor boolean para indicar se o formulário se encontra
  //editável ou apenas leitura
  const [edit, setEdit] = useState(false);

  const handleEdit = () => {
    setEdit(true);
  };

  //Form statevalue
  const formik = useFormik({
    initialValues: {
      name: dbProduct.name,
      categoryId: dbProduct.categoryId,
      price: dbProduct.price,
      isPromo: dbProduct.isPromo,
      promoPrice: dbProduct.isPromo ? dbProduct.promoPrice : 0,
      gender: dbProduct.gender ?? "allGender",
    },

    //validação de dados
    validationSchema: Yup.object({
      name: Yup.string().required("Nome é obrigatório"),
      price: Yup.number().min(1, "Preço precisa ser maior que R$0"),
      promoPrice: Yup.number().min(
        0,
        "Preço do desconto não pode ser menor que 0"
      ),
    }),
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Worflow para atualização:
      // 1 - criar o DTO e logo após
      // 2 - envia-lo para o redux e depois
      // 3 - enviar para o backend fazer as validações
      // 4 - subir para o supabase
      const product: Product = {
        id: dbProduct.id,
        name: values.name,
        categoryId: values.categoryId!,
        price: values.price,
        isPromo: values.isPromo,
        promoPrice: values.promoPrice,
        gender: values.gender,
      };

      try {
        setIsLoading(true);
        await updateProduct(product).then(async (res) => {
          if (newProfileImage) {
            await updateProfileImage(
              newProfileImage,
              res!.id!,
              profileImage!.id
            );
          }
          navigator.replace("/painel/produtos");
        });
      } catch {
        alert("Ocorreu algum erro! Verifique o console!");
      }
    },
  });

  // Generos
  const genders = [
    { value: "allGender", name: "Todos" },
    { value: "male", name: "Masculino" },
    { value: "female", name: "Feminino" },
    { value: "unisex", name: "Unissex" },
  ];

  // Ver se a imagem é undefined
  //const imgIsUndefined = !profileImage || profileImage?.endsWith("undefined")

  return (
    <main className="w-full flex flex-col items-start justify-center">
      <h1 className="w-full lg:text-start text-center font-bold text-2xl font-oswald uppercase tracking-widest">
        Editar produto!
      </h1>
      <form className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-3">
          <div className="form-section shadow">
            {formik.errors.name && (
              <small className="text-red-500">{formik.errors.name}</small>
            )}
            <div className="my-3">
              <label className="txt-label" htmlFor="name">
                Nome
              </label>
              <input
                disabled={!edit}
                type="text"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="txt-input min-h-14"
              />
            </div>
            <div className="my-3">
              <label className="txt-label" htmlFor="category">
                Categoria
              </label>
              <select
                disabled={!edit}
                name="categoryId"
                id="categoryId"
                value={formik.values.categoryId}
                onChange={formik.handleChange}
                className="txt-input bg-white p-3 min-h-14"
              >
                {categories.map((el, index) => (
                  <option key={index} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="my-3">
              <label className="txt-label" htmlFor="gender">
                Gênero
              </label>
              <select
                name="gender"
                id="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                className="txt-input bg-white p-3 min-h-14"
                disabled={!edit}
              >
                {genders.map((el, index) => (
                  <option key={index} value={el.value}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>
            {formik.errors.price && (
              <small className="text-red-500">{formik.errors.price}</small>
            )}
            <div className="my-3 flex flex-row items-center">
              <label
                htmlFor="price"
                className="border pl-1 rounded-tl rounded-bl border-r-0 py-2"
              >
                R$
              </label>
              <div className="w-full">
                <label className="txt-label -ml-3" htmlFor="price">
                  Preço
                </label>
                <input
                  disabled={!edit}
                  type="number"
                  name="price"
                  min={1}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  id="price"
                  className="txt-input border-l-0 rounded-tl-none rounded-bl-none min-h-14"
                />
              </div>
            </div>
            <div className="flex flex-col my-3">
              <div className="flex flex-row items-center gap-2">
                <label htmlFor="isPromo">É promoção? </label>
                <input
                  disabled={!edit}
                  type="checkbox"
                  className="checkbox"
                  checked={formik.values.isPromo}
                  onChange={formik.handleChange}
                  name="isPromo"
                  id="isPromo"
                />
              </div>
              {formik.values.isPromo === true && (
                <div className="my-3 flex flex-row items-center">
                  <label
                    htmlFor="price"
                    className="border pl-1 rounded-tl rounded-bl border-r-0 py-2"
                  >
                    R$
                  </label>
                  <div className="w-full">
                    <label htmlFor="promoValue" className="txt-label -ml-3">
                      Preço do produto com desconto:
                    </label>
                    <input
                      disabled={!edit}
                      type="number"
                      name="promoPrice"
                      className="txt-input border-l-0 rounded-tl-none rounded-bl-none min-h-14"
                      id="promoPrice"
                      value={formik.values.promoPrice}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="form-section shadow ">
            <h3 className="w-full font-oswald">Imagem principal:</h3>
            <hr className="my-2" />
            <div className="flex flex-row justify-center items-center h-full">
              {!edit ? (
                //Se não estiver no modo de edição, a imagem atual é mostrada
                <>
                  {profileImage?.url.endsWith("undefined") ? (
                    <h3 className="font-oswald">
                      Nenhuma imagem principal cadastrada!
                    </h3>
                  ) : (
                    <ImageContainer pictureId={profileImage.url} />
                  )}
                </>
              ) : (
                //Se não, o componente de upload de imagem é renderizado
                <ProfileUploadContainer
                  imageUrl={profileImage.url}
                  handleImage={handleProfileImage}
                  editable={edit}
                />
              )}
            </div>
          </div>
        </div>

        {/* Área de botôes ===================================== */}
        <div className="p-3 w-full flex max-[680px]:flex-col-reverse flex-row justify-center text-center max-[680px]:gap-4">
          <button
            type="button"
            onClick={() => {
              if (edit) {
                setEdit(false);
              } else {
                navigator.replace("/painel/produtos");
              }
            }}
            className="max-[680px]:w-full w-[220px] py-2 px-10 mx-2 text-white bg-red-500 transition-all hover:bg-red-600 shadow shadow-red-400 rounded"
          >
            {edit ? "Cancelar edição" : "Voltar"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!edit) {
                handleEdit();
              } else {
                formik.handleSubmit();
              }
            }}
            className={`flex items-center justify-center max-[680px]:w-full w-[220px] py-2 px-10 mx-2 text-white transition-all hover:bg-blue-600 shadow  shadow-blue-400 rounded ${
              edit ? "btn-green" : "btn-primary"
            }`}
          >
            {isLoading ? (
              <Loading color="#fff" size={20} />
            ) : edit ? (
              "Concluir!"
            ) : (
              "Editar produto"
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

export default ProdutoPage;
