"use client";

import { fetchSession } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useEffect } from "react";

const Usuario = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchSession());
  }, [dispatch]);
  return (
    <div>
      <div className="text-black text-wrap">
        <p>Email: {user.email}</p>
        <p>ID: {user.id}</p>
        <p>Telefone: {user.phone}</p>
        <p>Criado em:{user.created_at}</p>
      </div>
     
    </div>
  );
};

export default Usuario;
