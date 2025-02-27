"use client";

import { loadUserDataOnStorage } from "@/lib/utils";
import { fetchSession } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { FaList, FaShoppingCart } from "react-icons/fa";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const dispatch = useAppDispatch();
  const localUser = loadUserDataOnStorage();
  useLayoutEffect(() => {
    dispatch(fetchSession()).then(() => {
      if (localUser === null) {
        alert("Sessão expirada ou inexistente! Acesso negado!");
        window.location.href = "/";
      }
    });
  }, [dispatch, localUser]);
  return (
    <div className="w-full max-[480px]:px-2 max-[860px]:px-4 px-12">
      <div className="flex flex-row max-[860px]:items-center max-[860px]:justify-center mb-5 py-3 border-b">
        <Link
          className="w-[140px] flex flex-row items-center px-3 py-0.5 mr-2 hover:bg-black hover:text-white transition-all text-center text-black bg-white border border-black p-0 rounded tracking-wider"
          href="/painel/categorias"
        >
          <i className="mx-1">
            <FaList />
          </i>
          Categorias
        </Link>
        <Link
           className="w-[140px] flex flex-row items-center px-3 mx-2 py-0.5 hover:bg-black hover:text-white transition-all text-center text-black bg-white border border-black p-0 rounded tracking-wider"
          href="/painel/produtos"
        >
           <i className="mx-1">
            <FaShoppingCart />
          </i>
          Produtos
        </Link>
      </div>
      {children}
    </div>
  );
};

export default Layout;
