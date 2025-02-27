import { ProductDTO } from "@/core/models/DTOs/ProductDTO";
import { Product } from "@/core/models/Product";
import { Gender } from "@/core/models/enums/Gender";
import { ImageType } from "@/core/models/enums/ImageType";
import { uploadImages, uploadProfileImage } from "@/core/services/bucketService";
import {
  createProduct,
  getAllProducts,
  getProduct,
  getProductsByCategoryAndGender,
  updateProduct,
  getAllProductByPromo,
  deleteProductAsync,
} from "@/core/services/productService";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProductState {
  dto: ProductDTO;
  productList: Array<ProductDTO>;
  promoList: Array<ProductDTO>;
  newProductId?: number;
  filteredProductsList: Array<ProductDTO>;
}

export interface ProductSearch {
  categoryId: number;
  gender: Gender;
  isPromo: boolean;
  name: string;
}

const initialState: ProductState = {
  dto: {
    product: {
      id: 0,
      categoryId: 0,
      name: "",
      description: "",
      isPromo: false,
      price: 0,
      quantity: 0,
      gender: Gender.AllGender,
    },
    profileImage: { id: "", url: "", productId: 0, type: ImageType.Normal },
    images: [],
  },
  productList: new Array<ProductDTO>(),
  promoList: new Array<ProductDTO>(),
  filteredProductsList: new Array<ProductDTO>(),
  newProductId: 0,
};

export const fetchAllProducts = createAsyncThunk("products/fetchAll", async () => {
  return await getAllProducts();
});

export const fetchProductsByPromo = createAsyncThunk("products/fetchByPromo", async () => {
  return await getAllProductByPromo();
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (data: { product: Product; profileImage: File; images?: File[] }, thunkAPI) =>
    await createProduct(data.product).then(async (res) => {
      await uploadProfileImage(data.profileImage, res!.id!).then(async () => {
        if (data.images!.length > 0) {
          await uploadImages(data.images!, res!.id!).then(() =>
            thunkAPI.dispatch(fetchAllProducts())
          );
        }
      });
      return res;
    })
);

export const fetchProductById = createAsyncThunk<ProductDTO, number>(
  "product/fetch",
  async (id, { rejectWithValue }) => {
    try {
      const product = await getProduct(id);
      if (!product) {
        return rejectWithValue("Produto não encontrado");
      }
      return product;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllProductsByCategoryAndGender = createAsyncThunk(
  "product/getByCategoryAndGender",
  async (data: { categoryId: number; gender?: Gender }) => {
    return await getProductsByCategoryAndGender(data.categoryId, data.gender);
  }
);

export const updateProductAsync = createAsyncThunk(
  "product/update",
  async (data: { product: Product; image: File }, thunkAPI) => {
    await updateProduct(data.product).then(() => {
      thunkAPI.dispatch(fetchAllProducts());
    });
  }
);

export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (data: { id: number }, thunkAPI) => {
    await deleteProductAsync(data.id).then(() => {
      thunkAPI.dispatch(fetchAllProducts());
    });
  }
);

export const ProductSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProduct: (state, action: PayloadAction<number>) => {
      state.dto = state.productList.find((p) => p.product.id === action.payload)!;
    },
    searchProducts: (state, action: PayloadAction<ProductSearch>) => {
      console.log(action.payload);
      const value = state.productList
        .filter((p) => {
          const catId = action.payload.categoryId as number
          if (catId > 0) {
            return p.product.categoryId as number == catId;
          }
          return p;
        })
        .filter((p) => {
          if (action.payload.isPromo) {
            return p.product.isPromo === true;
          }
          return p;
        })
        .filter((p) => {
          if (action.payload.name.length > 0) {
            return p.product.name.toLowerCase().startsWith(action.payload.name.toLowerCase());
          }
          return p;
        })
        .filter((p) => {
          if (action.payload.gender !== Gender.AllGender) {
            return p.product.gender === action.payload.gender;
          }
          return p;
        });
        console.log(value)
      state.filteredProductsList = value;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.productList = action.payload!;
      state.filteredProductsList = action.payload!;
    });
    builder.addCase(fetchAllProductsByCategoryAndGender.fulfilled, (state, action) => {
      state.productList = action.payload!;
    });
    builder.addCase(fetchProductById.pending, (state) => {
      state.dto = initialState.dto;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.dto = action.payload!;
    });
    builder.addCase(addProduct.fulfilled, (state, action) => {
      state.newProductId = action.payload?.id;
    });
    builder.addCase(fetchProductsByPromo.fulfilled, (state, action) => {
      state.promoList = action.payload!;
    });
  },
});

export default ProductSlice.reducer;
export const { setProduct, searchProducts } = ProductSlice.actions;
