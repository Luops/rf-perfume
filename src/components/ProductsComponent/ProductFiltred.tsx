"use client";

import React, { useEffect } from "react";
import Image from "next/image";

// Store

// Models
import { ProductDTO } from "@/core/models/DTOs/ProductDTO";

// Components
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

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
      : dto.profileImage.url

  // Função para abrir o WhatsApp com uma mensagem personalizada
  const handleWhatsAppClick = () => {
    const numero = "5551984422056";
    const mensagem = `Olá, estou interessado no produto: ${dto.product.name}. Poderia me passar mais informações?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <article
      onClick={handleWhatsAppClick}
      key={dto.product.id}
      className="flex flex-col justify-evenly items-start max-[560px]:w-full max-[690px]:w-[250px] max-[940px]:w-[230px] w-[300px] font-oswald text-start cursor-pointer max-[420px]:border-b"
    >
      <div className="w-full">
        {showSkeleton ? (
          <Skeleton className="w-full max-[500px]:h-[250px] max-[640px]:h-[280px] h-[300px]" />
        ) : (
          <Image
            src={imageSrc}
            alt={dto.product.name}
            width={500}
            height={500}
            quality={100}
            className="w-full max-[500px]:h-[250px] max-[640px]:h-[280px] h-[300px] rounded object-cover"
          />
        )}

        <h3 className="max-[480px]:text-sm text-md text-gray-700 mt-2 line-clamp-1">
          {dto.product.name}
        </h3>
      </div>
      <h3
        className={`w-full text-md font-semibold text-start ${
          dto.product.isPromo ? "line-through text-black/60" : "text-black/85"
        }`}
      >
        R$ {dto.product.price.toFixed(2).replace(".", ",")}
      </h3>
      {/* Preço promocional - visível apenas se isPromo for true */}
      <h3
        className={`w-full text-2xl font-semibold text-start ${
          dto.product.isPromo ? "text-orange-500 visible" : "invisible"
        }`}
      >
        R$ {dto.product.promoPrice?.toFixed(2).replace(".", ",")}
      </h3>
      <Button
        onClick={handleWhatsAppClick}
        className="bg-white border border-[#81D8D0] hover:border-white text-[#6bb3ab] hover:text-white shadow-[0px_4px_4px_rgba(0,0,0,0.05)] tracking-wide max-[420px]:mx-auto"
      >
        Entrar em contato
      </Button>
    </article>
  );
}

export default ProductFiltred;
