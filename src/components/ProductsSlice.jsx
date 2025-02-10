import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch('https://dummyjson.com/products');
  const data = await response.json();
  return data.products;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedProduct: null,
    quantity: 1,
    cart: [],
    cartVisible: false
  },
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    incrementQuantity: (state) => {
      state.quantity += 1;
    },
    decrementQuantity: (state) => {
      if (state.quantity > 1) {
        state.quantity -= 1;
      }
    },
    resetQuantity: (state) => {
      state.quantity = 1;
    },
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ ...product, quantity });
      }
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find(item => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },
    toggleCart: (state) => {
      state.cartVisible = !state.cartVisible;
    },
    clearCart: (state) => {
      state.cart = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { 
  setSelectedProduct, 
  incrementQuantity, 
  decrementQuantity, 
  resetQuantity,
  addToCart, 
  removeFromCart, 
  updateCartQuantity, 
  toggleCart,
  clearCart 
} = productsSlice.actions;
export default productsSlice.reducer;
