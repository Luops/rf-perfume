/* eslint-disable react-hooks/rules-of-hooks */
"use client";

// import { login } from '@/core/services/userService';
import { useRouter } from "next/navigation";
import React, { useState } from "react";

// Next
import Link from "next/link";

// Store
import { fetchLogin } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";

// Components
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { saveUserDataOnStorage } from "@/lib/utils";

// Icons
import { Eye, EyeOff } from "lucide-react";

function page() {
  const dispatch = useAppDispatch();
  const navigator = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mostrar senha
  const [showPassword, setShowPassword] = useState(false);

  // Erros
  const [emailError, setEmailError] = useState("");

  const handleSubmit = () => {
    setIsSubmitting(true);
    try {
      dispatch(fetchLogin({ email, password })).then((res) => {
        const user = res.payload as User;
        saveUserDataOnStorage(user);
        if (user) {
          setIsSubmitting(false);
          navigator.replace("/");
        }
      });

      // Aguardar a resposta do login por 10 segundos
      setTimeout(() => {
        setIsSubmitting(false);
        setEmailError(
          "Verifique email e senha! Caso persista contate o suporte."
        );
      }, 10000);
    } catch (error) {
      setIsSubmitting(false);
      console.log(error);
    }
  };
  return (
    <main className="flex w-full items-center justify-center">
      <section
        className={`flex flex-col items-center text-center gap-2 max-[560px]:w-full max-[680px]:w-[500px] w-[600px] max-[480px]:mt-0 max-[560px]:px-5 mt-8`}
      >
        <h3 className="leading-9 tracking-tight font-bold text-[2rem] w-full">
          Entre na sua conta
        </h3>
        <p className="leading-7 tracking-tight font-[300] text-[0.8rem] w-full text-gray-500">
          Você é um administrador? Faça o login aqui ou{" "}
          <span className="font-[500] text-slate-800">
            <Link href={"/"} className="font-bold">
              volte para a Home.
            </Link>
          </span>
        </p>
        <form action="" className="space-y-8 w-full mt-6">
          <label htmlFor="" className="w-full flex flex-col text-left">
            <p className="w-full !font-[600] leading-6 tracking-wide text-sm">
              Email
            </p>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 border rounded-md px-2 py-2 focus:outline-none focus:border-slate-800"
            />
          </label>
          <label htmlFor="" className="w-full flex flex-col text-left">
            <p className="w-full !font-[600] leading-6 tracking-wide text-sm">
              Senha
            </p>
            <div className="w-full !h-10 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-full border rounded-md px-2 focus:outline-none focus:border-slate-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? (
                  <i className="relative z-20">
                    <EyeOff size={20} />
                  </i>
                ) : (
                  <i className="relative z-20">
                    <Eye size={20} />
                  </i>
                )}
              </button>
            </div>
          </label>
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full text-md font-semibold !mt-16"
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
          {emailError && <p className="text-red-500 mt-16">{emailError}</p>}
        </form>
      </section>
    </main>
  );
}

export default page;
