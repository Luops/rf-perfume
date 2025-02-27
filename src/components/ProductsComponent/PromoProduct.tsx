"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Components
import { Skeleton } from "../ui/skeleton";

// Model
import { ProductDTO } from "@/core/models/DTOs/ProductDTO";

// Images
import Logo from "@/assets/images/logo.png";

function PromoProduct({ dto }: { dto: ProductDTO }) {
  // Estado para controlar o Skeleton
  const [showSkeleton, setShowSkeleton] = React.useState(true);
  // Controle de exibição do Skeleton
  useEffect(() => {
    const timer = setTimeout(() => setShowSkeleton(false), 500); // 500 milisegundos

    return () => clearTimeout(timer); // Limpeza do timer
  }, []);

  // Validar imagem
  const imageSrc =
    !dto.profileImage || dto.profileImage.url.endsWith("undefined")
      ? Logo
      : dto.profileImage.url;
  return (
    <Link
      href={`/product/${dto.product.id}`}
      target="_blank"
      rel="noopener noreferrer"
      key={dto.product.id}
      className="flex flex-col justify-evenly max-[360px]:items-center items-start max-[813px]:w-[100%] w-[250px] max-[1440px]:h-[322px] h-[360px] p-2 font-oswald max-[360px]:text-center text-start"
    >
      <div className="flex flex-col relative">
        {showSkeleton ? (
          <>
            <Skeleton className="w-48 max-[1440px]:h-48 h-56" />
          </>
        ) : (
          <Image
            src={imageSrc}
            alt={dto.product.name}
            width={500}
            height={500}
            quality={100}
            className="w-full max-[1440px]:h-48 h-56 rounded object-contain"
          />
        )}
        <h4 className="max-[480px]:text-sm text-md text-gray-700 mt-2 line-clamp-2">
          {dto.product.name}
        </h4>
      </div>
      <p className="w-full text-md text-black/85 font-semibold line-through max-[360px]:text-center text-start">
        R$ {dto.product.price.toFixed(2).replace(".", ",")}
      </p>
      <p className="w-full text-2xl text-orange-500 font-semibold max-[360px]:text-center text-start">
        R$ {dto.product.promoPrice?.toFixed(2).replace(".", ",")}
      </p>
    </Link>
  );
}

export default PromoProduct;
