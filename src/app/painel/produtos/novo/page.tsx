/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Product } from "@/core/models/Product";
import { fetchAllCategories } from "@/store/slices/categorySlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addProduct } from "@/store/slices/productSlice";

// Components
import Loading from "@/components/Loading/Loading";

// Enum
import { Gender } from "@/core/models/enums/Gender";
import ProfileUploadContainer from "@/components/UploadContainer/ProfileUploadContainer";
import UploadContainer from "@/components/UploadContainer/UploadContainer";
import UploadPreview from "@/components/UploadContainer/UploadPreview";

const NovoProduto = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categoryList);
  const [isLoading, setIsLoading] = useState(false);
  const [isPromo, setIsPromo] = useState(false);

  //Arquivo de imagem
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [images, setImages] = useState<File[] | null>([]);
  const [profileImageField, setProfileImageField] = useState(true);

  // Preco e desconto
  //const [promoPrice, setPromoPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [qteTotal, setQteTotal] = useState(0);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const navigator = useRouter();

  // Formatar os generos
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
  // console.log("Genders: ", gendersNewNames);

  //form state
  const formik = useFormik({
    initialValues: {
      name: "",
      categoryId: categories[0]?.id,
      quantity: 0,
      price: 0,
      isPromo: false,
      promoPrice: 0,
      description: "",
      gender: Gender.AllGender,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Nome é obrigatório"),
      quantity: Yup.number().min(1, "Quantidade precisa ser maior que 0"),
      price: Yup.number().min(1, "Preço precisa ser maior que R$0"),
      description: Yup.string().required("Descrição é obrigatório"),
      promoPrice: isPromo
        ? Yup.number().min(1, "Preço do desconto não pode ser 0")
        : Yup.number(),
    }),
    enableReinitialize: true,
    validateOnChange: false,
    onSubmit: (values) => {
      const product: Product = {
        name: values.name,
        categoryId: values.categoryId!,
        quantity: values.quantity,
        price: values.price,
        isPromo: isPromo,
        promoPrice: values.promoPrice,
        description: values.description,
        gender: values.gender,
      };
      if (profileImage == null) {
        setProfileImageField(false);
        return;
      }
      setIsLoading(true);
      dispatch(
        addProduct({
          product: product,
          profileImage: profileImage!,
          images: images!,
        })
      )
        .then(() => {
          navigator.replace("/painel/produtos");
        })
        .catch(() => {
          alert(
            "Ocorreu algum erro, preencha todos os campos ou verifique no devtools!"
          );
        });
    },
  });

  function handleDiscount(): number {
    const price = formik.values.price;
    const promoPrice = formik.values.promoPrice;

    return price - promoPrice;
  }

  function handleQteTotal(): number {
    const priceFinal =
      formik.values.promoPrice > 0
        ? formik.values.promoPrice
        : formik.values.price;
    const qte = formik.values.quantity;
    return qte * priceFinal;
  }

  useEffect(() => {
    setDiscount(handleDiscount());
    setQteTotal(handleQteTotal());
    console.log("changed!");
  }, [formik.values.price, formik.values.promoPrice, formik.values.quantity]);

  const handleProfileImage = (file: File) => {
    setProfileImage(file);
    setProfileImageField(true);
  };

  const handleImage = (file: File) => {
    setImages((arr) => [...arr!, file]);
  };

  const handleImageDelete = (index: number) => {
    setImages((arr) => arr!.filter((_, i) => i !== index));
  };

  return (
    <main className="w-full flex flex-col items-start justify-center">
      <h1 className="w-full lg:text-start text-center font-bold text-2xl font-oswald uppercase tracking-widest">
        Adicione um novo produto!
      </h1>
      <form className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 lg:gap-3">
          <div className="form-section">
            {formik.errors.name && (
              <small className="text-red-500">{formik.errors.name}</small>
            )}
            <div className="my-3">
              <label className="txt-label" htmlFor="name">
                Nome
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="txt-input"
              />
            </div>
            <div className="my-3">
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
                {categories.map((el, index) => (
                  <option key={index} value={el.id}>
                    {el.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="my-3">
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
            {formik.errors.quantity && (
              <small className="text-red-500">{formik.errors.quantity}</small>
            )}
            <div className="my-3">
              <label className="txt-label" htmlFor="quantity">
                Quantidade
              </label>
              <input
                type="number"
                name="quantity"
                min={1}
                value={formik.values.quantity}
                onChange={formik.handleChange}
                id="quantity"
                className="txt-input"
              />
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
                  type="number"
                  name="price"
                  min={1}
                  step={0.01}
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  id="price"
                  className="txt-input border-l-0 rounded-tl-none rounded-bl-none"
                />
              </div>
            </div>
            <div className="my-3">
              <label htmlFor="isPromo">É promoção? </label>
              <input
                type="checkbox"
                className="checkbox"
                checked={isPromo}
                onChange={(e) => setIsPromo(e.target.checked)}
                name="isPromo"
                id="isPromo"
              />
              {isPromo && (
                <div className="my-3 flex flex-row items-center">
                  <label
                    htmlFor="price"
                    className="border pl-1 rounded-tl rounded-bl border-r-0 py-2"
                  >
                    R$
                  </label>
                  <div className="w-full">
                    <label htmlFor="promoValue" className="txt-label -ml-3">
                      Preço com desconto
                    </label>
                    <input
                      type="number"
                      name="promoPrice"
                      className="txt-input border-l-0 rounded-tl-none rounded-bl-none"
                      id="promoPrice"
                      value={formik.values.promoPrice}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>
              )}
            </div>
            {formik.errors.description && (
              <small className="text-red-500">
                {formik.errors.description}
              </small>
            )}
            <div className="my-3">
              <label className="txt-label" htmlFor="description">
                Descrição
              </label>
              <textarea
                name="description"
                rows={5}
                id="description"
                maxLength={500} // Define o limite máximo de caracteres
                className="txt-input"
                value={formik.values.description}
                onChange={(e) => {
                  // Limita caracteres com validação adicional
                  if (e.target.value.length <= 500) {
                    formik.handleChange(e);
                  }
                }}
              />
              <div className="text-right text-sm text-gray-500 mt-1">
                {formik.values.description.length}/500 caracteres
              </div>
            </div>

            <div className="my-3">
              <div className="flex flex-row justify-between items-center my-1">
                <h3 className="break-before whitespace-nowrap mr-2 text-gray-600">
                  Preço do produto:
                </h3>
                <span className="w-full border-b mr-2"></span>
                <h3 className="text-gray-600 text-xl">
                  R${formik.values.price > 0 && formik.values.price.toFixed(2)}
                </h3>
              </div>
              <div className="flex flex-row justify-between items-center my-1">
                <h3 className="break-before whitespace-nowrap  text-gray-600 mr-2">
                  Desconto:
                </h3>
                <span className="w-full border-b mr-2"></span>
                <h3 className="text-gray-600 text-xl">
                  R$
                  {formik.values.promoPrice > 0 && discount.toFixed(2)}
                </h3>
              </div>
              <div className="flex flex-row justify-between italic items-center my-3">
                <h3 className="break-before whitespace-nowrap mr-2 text-sm text-gray-600">
                  Total em quantidade:
                </h3>
                <span className="w-full border-b mr-2"></span>
                <h3 className="text-gray-600">R${qteTotal.toFixed(2)}</h3>
              </div>
            </div>
            <hr className="my-3" />
            <div className="flex flex-row justify-between items-center my-3">
              <h3 className="break-before whitespace-nowrap mr-2 font-semibold text-gray-600">
                Total do produto:
              </h3>
              <span className="w-full border-b mr-2"></span>
              <h3 className="text-emerald-500 font-semibold text-xl">
                R$
                {formik.values.promoPrice > 0
                  ? formik.values.promoPrice.toFixed(2)
                  : formik.values.price.toFixed(2)}
              </h3>
            </div>
          </div>

          {/* Imagens --------------------------------------------------------------------------------------------- */}
          <div className="form-section">
            {/* Container para carregar imagem de perfil do produto: */}
            <div className="flex flex-col items-center h-full w-full">
              <h3 className="w-full font-oswald">Imagem principal:</h3>
              {!profileImageField && (
                <h3 className="w-full my-5 text-red-500">
                  Por favor, selecione uma imagem de perfil!
                </h3>
              )}
              <ProfileUploadContainer
                imageUrl={profileImage ? URL.createObjectURL(profileImage) : ""}
                handleImage={handleProfileImage}
              />
            </div>
            {/* <hr /> */}
          </div>
        </div>
        <h3 className="w-full my-3 font-oswald">Outras imagens:</h3>
        <hr className="mb-5" />
        <div className="p-2">
          <div className="grid grid-cols-3 gap-3 w-full rounded border p-2">
            {images?.map((el, index) => (
              <div key={index} className="w-full">
                <UploadPreview
                  image={el}
                  key={index}
                  index={index}
                  handleDelete={handleImageDelete}
                />
              </div>
            ))}
            <div className="p-1">
              <UploadContainer handleImage={handleImage} />
            </div>
          </div>
        </div>
        <div className="p-3 w-full flex max-[680px]:flex-col-reverse flex-row justify-center text-center max-[680px]:gap-4">
          <button
            type="button"
            onClick={() => navigator.back()}
            className="max-[680px]:w-full w-[220px] py-2 px-10 mx-2 btn-black"
          >
            Voltar
          </button>
          <button
            type="button"
            onClick={() => formik.handleSubmit()}
            className="flex items-center justify-center max-[680px]:w-full w-[220px] py-2 px-10 mx-2 btn-green rounded"
          >
            {isLoading ? (
              <Loading color="#fff" size={20} />
            ) : (
              "Cadastrar produto!"
            )}
          </button>
        </div>
      </form>
    </main>
  );
};

export default NovoProduto;
