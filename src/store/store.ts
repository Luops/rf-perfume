import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { AuthSlice } from "./slices/authSlice";
import { ProductSlice } from "./slices/productSlice";
import { CategorySlice } from "./slices/categorySlice";

export const store = configureStore({
  reducer: {
    auth: AuthSlice.reducer,
    products: ProductSlice.reducer,
    categories: CategorySlice.reducer,
  },
  devTools: true,
});

export const useAppDispatch: () => typeof store.dispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<
  ReturnType<typeof store.getState>
> = useSelector;
