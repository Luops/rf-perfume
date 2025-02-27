"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";

// Store
import { useAppDispatch, useAppSelector } from "@/store/store";

// Components
import Loading from "@/components/Loading/Loading";
import { Skeleton } from "@/components/ui/skeleton";

// Slice
import { fetchProductById } from "@/store/slices/productSlice";

// Model
import { Product } from "@/core/models/Product";

// Icons
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

// Images
import Logo from "@/assets/images/logo.png";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

function ProductIdPage() {
  const [loading, setLoading] = useState(true);

  const paramsUrl = useParams<{ productId: string }>();

  // Product
  const dispatch = useAppDispatch();
  const productDto = useAppSelector((state) => state.products.dto);
  const productById: Product = productDto.product;

  console.log("Produto DTO: ", productDto);

  useEffect(() => {
    const fetchProduct = async () => {
      const productId = Number(paramsUrl.productId);
      if (!paramsUrl.productId) return;

      setLoading(true);
      await dispatch(fetchProductById(productId)); // Corrigido para garantir que o ID seja um número
      setLoading(false);
    };

    fetchProduct();
  }, [dispatch, paramsUrl.productId]); // Adicionado productId como dependência

  // Validar imagem
  const imageSrc =
    !productDto.profileImage ||
    productDto.profileImage.url.endsWith("undefined")
      ? Logo
      : productDto.profileImage.url;

  // Carregar imagens secundárias
  const images = productDto.images || [];
  console.log("Imagens do produto:", images);

  // Controle do Swiper
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <main className="w-full flex min-h-screen flex-col items-center justify-start max-[980px]:px-0 px-12 font-oswald tracking-wider mb-10">
      {productById ? (
        <section className="w-full flex flex-col">
          {loading ? (
            <Skeleton className="max-[980px]:hidden flex h-5 w-[200px]" />
          ) : (
            <div className="max-[980px]:hidden w-full flex items-center justify-start gap-1">
              <Link
                href={"/"}
                className="text-gray-500 text-md min-[1440px]:text-lg"
              >
                Home
              </Link>
              <h3 className="text-gray-500 mt-1">/</h3>
              <h3 className="text-md min-[1440px]:text-lg">
                {productById.name}
              </h3>
            </div>
          )}
          <div
            className={`w-full flex max-[980px]:flex-col ${
              images.length > 0
                ? "max-[1440px]:h-[600px]"
                : "max-[1440px]:h-[500px]"
            } h-[650px] max-[980px]:items-center gap-10`}
          >
            {loading ? (
              <div className="max-[980px]:w-full max-[980px]:h-[850px] max-[980px]:object-cover min-[981px]:h-[500px] min-[981px]:w-[500px] min-[1440px]:h-[650px] min-[1440px]:w-[650px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border border-[#f2f2f2] bg-gray-200 flex items-center justify-center rounded-lg">
                <div className="max-[380px]:h-[450px] max-[480px]:h-[550px] max-[680px]:h-[650px] max-[980px]:h-[850px] flex flex-col items-center justify-center">
                  <Loading size={50} color="#3498db" />
                  <p>Carregando imagem...</p>
                </div>
              </div>
            ) : (
              /* <Image
              src={imageSrc}
              alt={`Imagem do produto ${productById.name}`}
              className="max-[980px]:w-full max-[980px]:h-[850px] object-cover min-[981px]:w-[500px] min-[1441px]:w-[650px] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border border-[#f2f2f2]"
              width={500} // Ajuste um tamanho adequado
              height={500} // Defina uma altura real
              quality={100} // Mantém a máxima qualidade
              unoptimized
            /> */
              <section className="max-[980px]:w-full max-[980px]:h-[1260px] h-full min-[981px]:w-[500px] min-[1441px]:w-[650px] flex flex-col">
                {/* Swiper Principal */}
                <Swiper
                  loop={true}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper }}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="w-full rounded-lg overflow-hidden"
                >
                  <SwiperSlide>
                    <Image
                      src={imageSrc}
                      alt={`Imagem do produto ${productById.name}`}
                      width={500}
                      height={500}
                      className="w-full max-[980px]:h-[95%] h-full object-cover drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border border-[#f2f2f2]"
                    />
                  </SwiperSlide>
                  {images.map((img, index) => (
                    <SwiperSlide key={index}>
                      <Image
                        src={img.url}
                        alt={`Imagem adicional ${index + 1}`}
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Swiper Miniaturas */}
                {images.length > 0 && (
                  <div className="relative w-full overflow-x-auto !px-2">
                    <Swiper
                      onSwiper={setThumbsSwiper}
                      spaceBetween={10}
                      slidesPerView={"auto"}
                      freeMode={true}
                      watchSlidesProgress={true}
                      modules={[FreeMode, Navigation, Thumbs]}
                       className="mt-1 w-full !overflow-x-auto whitespace-nowrap snap-x snap-mandatory"
                    >
                      <SwiperSlide>
                        <Image
                          src={imageSrc}
                          alt="Imagem principal"
                          width={80}
                          height={80}
                          className="w-[100px] h-20 object-cover border-2 border-gray-300 rounded-lg cursor-pointer"
                        />
                      </SwiperSlide>
                      {images.map((img, index) => (
                        <SwiperSlide key={index}>
                          <Image
                            src={img.url}
                            alt={`Miniatura ${index + 1}`}
                            width={80}
                            height={80}
                            className="w-[100px] h-20 object-cover border-2 border-gray-300 rounded-lg cursor-pointer"
                          />
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
              </section>
            )}
            <div className="max-[980px]:w-full w-[50%] flex flex-col gap-10 max-[980px]:h-auto max-[1440px]:h-[500px] h-[574px] font-light max-[480px]:px-2 max-[980px]:px-4">
              <div className="h-fit flex flex-col justify-between gap-5 ">
                {loading ? (
                  <>
                    <Skeleton className="max-[1440px]:h-7 h-10 w-[150px]" />
                    <div className="flex flex-col mt-2 gap-5">
                      <Skeleton className="max-[1440px]:h-7 h-10 w-full" />
                      <Skeleton className="max-[1440px]:h-7 h-10 w-full" />
                      <Skeleton className="max-[1440px]:h-7 h-10 w-full" />
                    </div>
                    <div className="flex flex-col mt-2 gap-1">
                      <Skeleton className="max-[1440px]:h-8 h-10 w-[120px]" />
                      <Skeleton className="max-[1440px]:h-8 h-10 w-[120px]" />
                      <Skeleton className="max-[1440px]:h-8 h-10 w-[180px]" />
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="max-[1440px]:text-xl text-3xl">
                      {productById.name}
                    </h2>
                    <p className="text-md min-[1440px]:text-lg font-sans max-[980px]:text-justify">
                      {productById.description}
                    </p>
                    <div className="flex flex-col gap-2">
                      {productById.isPromo && productById.promoPrice ? (
                        <>
                          <h3 className="text-xl font-semibold line-through">
                            R$ {productById.price.toFixed(2).replace(".", ",")}
                          </h3>
                          <h3 className="text-3xl font-semibold text-orange-500">
                            R${" "}
                            {productById.promoPrice
                              .toFixed(2)
                              .replace(".", ",")}
                          </h3>
                        </>
                      ) : (
                        <h3 className="text-2xl font-semibold">
                          R$ {productById.price.toFixed(2).replace(".", ",")}
                        </h3>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Quantidade:</span>
                        <span className="">
                          {productById.quantity > 0
                            ? productById.quantity + " em estoque"
                            : "Sem estoque"}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="h-fit flex flex-col gap-2 mb-10">
                <Link
                  href={"/"}
                  className="flex justify-center bg-black/95 hover:bg-black/85 transition-all ease-in-out duration-300 text-white font-bold py-4 max-[980px]:mt-4 max-[980px]:w-full w-[250px] font-sans text-md rounded-lg"
                >
                  Falar com o Vendedor
                </Link>
                <div className="max-[980px]:w-full flex max-[980px]:justify-center gap-4 max-[980px]:mt-4">
                  <Link href={"/"}>
                    <i>
                      <FaWhatsapp className="text-4xl" />
                    </i>
                  </Link>
                  <Link href={"/"}>
                    <i>
                      <FaFacebook className="text-4xl" />
                    </i>
                  </Link>
                  <Link href={"/"}>
                    <i>
                      <FaInstagram className="text-4xl" />
                    </i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="w-full flex flex-col items-center justify-center">
          {loading && (
            <>
              <Loading size={50} color="#3498db" />
              <p>Carregando produto...</p>
            </>
          )}
        </div>
      )}
    </main>
  );
}

export default ProductIdPage;
