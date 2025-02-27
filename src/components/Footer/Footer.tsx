"use client";
import React from "react";

import Link from "next/link";
import Image from "next/image";

// Images
import Logo from "@/assets/images/logo-semfundo.svg";

function Footer() {
  return (
    <footer className="w-full py-10 flex flex-col items-center justify-center bg-black/90">
      <Link
        href="https://www.ellyon.com.br/"
        target="_blank"
        className="flex flex-col items-center gap-5"
      >
        <Image src={Logo} alt="Logo Ellyon" className="w-[150px]" />
        <h3 className="text-white tracking-wide">
          Desenvolvido por Ellyon ©{new Date().getFullYear()} | Todos os
          direitos reservados.
        </h3>
      </Link>
    </footer>
  );
}

export default Footer;
