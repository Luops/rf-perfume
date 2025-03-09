import { Category } from "@/core/models/Category";
import {
  createCategory,
  getAllCategories,
  deleteCategory as removeCategory,
} from "@/core/services/categoryService";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface CategoryState {
  category: Category;
  categoryList: Array<Category>;
}

const initialState: CategoryState = {
  category: {
    name: "",
    color: "",
    value: "",
  },
  categoryList: new Array<Category>(),
};

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAll",
  async () => {
    return await getAllCategories();
  }
);

export const addCategory = createAsyncThunk(
  "categories/add",
  async (data: { name: string; color: string; value: string }, thunkAPI) => {
    return await createCategory(data).then(() =>
      thunkAPI.dispatch(fetchAllCategories())
    );
  }
);

export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (id: number, thunkAPI) => {
    await removeCategory(id);
    thunkAPI.dispatch(fetchAllCategories());
  }
);

export const CategorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.categoryList = action.payload!;
    });
  },
});

export default CategorySlice.reducer;
export const {} = CategorySlice.actions;
