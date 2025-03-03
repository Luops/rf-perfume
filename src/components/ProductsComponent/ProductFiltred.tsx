"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Store

// Models
import { ProductDTO } from "@/core/models/DTOs/ProductDTO";

// Components
import { Skeleton } from "../ui/skeleton";

// Images
import Logo from "@/assets/images/logo.png";

function ProductFiltred({ dto }: { dto: ProductDTO }) {
  // Estado para controlar o Skeleton
  const [showSkeleton, setShowSkeleton] = React.useState(true);
  // Controle de exibição do Skeleton
  useEffect(() => {
    const timer: NodeJS.Timeout = setTimeout(() => setShowSkeleton(false), 500); // 500 milisegundos

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
      className="flex flex-col justify-evenly items-start max-[500px]:w-full max-[690px]:w-[250px] max-[940px]:w-[230px] w-[300px] p-2 font-oswald text-start"
    >
      <div className="w-full">
        {showSkeleton ? (
          <Skeleton className="max-[360px]:h-[350px] max-[500px]:h-[250px] max-[640px]:h-[350px] max-[940px]:h-[300px] h-[400px]" />
        ) : (
          <Image
            src={imageSrc}
            alt={dto.product.name}
            width={500} // Ajuste um tamanho adequado
            height={500} // Defina uma altura real
            quality={100} // Mantém a máxima qualidade
            className="w-full max-[360px]:h-[350px] max-[500px]:h-[250px] max-[640px]:h-[350px] max-[940px]:h-[300px] h-[350px] rounded object-cover"
          />
        )}

        <h3 className="max-[480px]:text-sm text-md text-gray-700 mt-2 line-clamp-1">
          {dto.product.name}
        </h3>
      </div>
      <p
        className={`w-full text-md font-semibold max-[360px]:text-center text-start ${
          dto.product.isPromo ? "line-through text-black/60" : "text-black/85"
        }`}
      >
        R$ {dto.product.price.toFixed(2).replace(".", ",")}
      </p>
      {/* Preço promocional - visível apenas se isPromo for true */}
      <p
        className={`w-full text-2xl font-semibold max-[360px]:text-center text-start ${
          dto.product.isPromo ? "text-orange-500 visible" : "invisible"
        }`}
      >
        R$ {dto.product.promoPrice?.toFixed(2).replace(".", ",")}
      </p>
    </Link>
  );
}

export default ProductFiltred;
