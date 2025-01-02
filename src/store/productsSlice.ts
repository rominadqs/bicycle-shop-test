import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Option, NewProduct } from "../types";

export interface ProductCharacteristic {
  id: number;
  productId: number;
  name: string;
  options: Option[];
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  category: string;
  characteristics: ProductCharacteristic[];
  rules: any[];
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  fetched: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductsState = {
  products: [],
  loading: false,
  fetched: false,
  error: null,
};

// Thunk to fetch products from the API
export const fetchProducts = createAsyncThunk<Product[]>(
  "products/fetchProducts",
  async () => {
    const rawResponse = await fetch("/api/products");
    if (!rawResponse.ok) {
      throw new Error("Failed to fetch products");
    }
    const res = await rawResponse.json();
    return res.data.products;
  }
);

// Thunk to add a product
export const addProduct = createAsyncThunk<Product, NewProduct>(
  "products/addProduct", 
  async (newProduct) => {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });

    if (!res.ok) {
      throw new Error("Failed to add product");
    }
    return (await res.json()) as Product;
  }
);

// Thunk to delete a product
export const deleteProduct = createAsyncThunk<number, number>(
  "products/deleteProduct",
  async (id) => {
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      throw new Error("Failed to delete product");
    }
    return id; 
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.fetched = false;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.fetched = true;
        state.error = action.error.message || "Failed to fetch products";
      })
      // Add product
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })
      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
