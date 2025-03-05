"use client";
import React, { useEffect } from "react";
import Image from "next/image";

// Components
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

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

  // Função para abrir o WhatsApp com uma mensagem personalizada
  const handleWhatsAppClick = () => {
    const numero = "5551984422056";
    const mensagem = `Olá, estou interessado na promocao do produto: ${dto.product.name}. Poderia me passar mais informações?`;
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  return (
    <article
      onClick={handleWhatsAppClick}
      key={dto.product.id}
      className="flex flex-col justify-evenly max-[360px]:items-center items-start max-[813px]:w-[100%] w-[250px] max-[1440px]:h-[322px] h-[360px] p-2 font-oswald max-[360px]:text-center text-start cursor-pointer"
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
            className="w-full max-[1440px]:h-44 h-56 rounded object-contain bg-white"
          />
        )}
        <h4 className="max-[480px]:text-sm text-md text-gray-700 mt-2 line-clamp-2">
          {dto.product.name}
        </h4>
      </div>
      <h3 className="w-full text-md text-black/85 font-semibold line-through max-[360px]:text-center text-start">
        R$ {dto.product.price.toFixed(2).replace(".", ",")}
      </h3>
      <h3 className="w-full text-2xl text-orange-500 font-semibold max-[360px]:text-center text-start">
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

export default PromoProduct;
