import React from "react";

// Components

// Icons
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "../ui/button";

function ContactSection() {
  // Função para abrir o WhatsApp com uma mensagem personalizada
  const handleWhatsAppClick = () => {
    const numero = "5551984422056";
    const url = `https://wa.me/${numero}`;
    window.open(url, "_blank");
  };
  return (
    <section
      id="contact"
      className="w-full max-[680px]:h-auto h-[350px] flex max-[680px]:flex-col-reverse items-center justify-between gap-4 max-[480px]:px-2 max-[860px]:px-4 px-6 mb-10"
    >
      <div className="w-full max-[680px]:h-[350px] h-full flex flex-col items-center justify-center gap-2 border border-[#f5f5f5] rounded-xl px-4 shadow-[0px_4px_4px_rgba(0,0,0,0.05)]">
        <i>
          <FaWhatsapp className="max-[480px]:text-[100px] text-[150px]" />
        </i>
        <h4 className="font-bold uppercase font-sans text-4xl text-center">
          Entrar em contato
        </h4>
        <div className="flex gap-2 items-center">
          <p className="font-semibold text-lg">(51)9 8442-2056</p>
          <Button
            onClick={handleWhatsAppClick}
            className="text-black bg-white hover:bg-gray-200 transition-all ease-in-out duration-300 border-[#d7d7d7] border-[2px] px-2 py-1 rounded font-semibold uppercase font-oswald"
          >
            Chamar
          </Button>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
