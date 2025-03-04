import React, { useState } from "react";

// Store
import { useAppDispatch, useAppSelector } from "@/store/store";

// Core
import { ProductDTO } from "@/core/models/DTOs/ProductDTO";

// Slice
import { fetchProductsByPromo } from "@/store/slices/productSlice";

// Model

// Components
import PromoProduct from "../ProductsComponent/PromoProduct";
import Loading from "../Loading/Loading";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../../app/globals.css";

// import required modules
import { Navigation } from "swiper/modules";

function PromoSection() {
  const [loading, setLoading] = useState(true);

  // Produtos
  const dispatch = useAppDispatch();
  const promoList: ProductDTO[] = useAppSelector(
    (state) => state.products.promoList
  );

  React.useEffect(() => {
    const fetchPromoProducts = async () => {
      setLoading(true);
      await dispatch(fetchProductsByPromo());
      setLoading(false);
    };
    fetchPromoProducts();
  }, [dispatch]);
  return (
    <section id="promos" className={`${promoList.length > 0 ? "flex flex-col" : "hidden"} w-full max-[480px]:px-2 max-[860px]:px-4 px-6`}>
      <div className="w-full flex flex-col items-start justify-center bg-[#f5f5f5] drop-shadow-[0px_4px_4px_rgba(0,0,0,0.05)] border border-[#f2f2f2] pb-4">
        <h4 className="w-full flex items-center h-20 text-white text-3xl font-oswald bg-black px-3 uppercase tracking-[1px]">
          Promoções
        </h4>
        <>
          <Swiper
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
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
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 25,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
              1366: {
                slidesPerView: 5,
                spaceBetween: 30,
              },
            }}
            className="mySwiper w-full"
          >
            {loading ? (
              <div className="flex flex-col h-[322px] text-center items-center justify-center">
                <h4 className="">Carregando...</h4>
                <Loading size={50} color="#3498db" />
              </div>
            ) : (
              <>
                {promoList && promoList.length > 0 ? (
                  promoList.map((dto: ProductDTO) => (
                    <SwiperSlide
                      key={dto.product.id}
                      className="w-full flex !items-center !justify-center"
                    >
                      <PromoProduct dto={dto} />
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-[250px] text-center">
                    <h3 className="font-oswald tracking-wider text-xl">
                      Nenhum produto em promoção.
                    </h3>
                  </div>
                )}
              </>
            )}
          </Swiper>
        </>
      </div>
    </section>
  );
}

export default PromoSection;
