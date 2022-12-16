import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

interface ProductsState {
    products: [],
    loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = { products: [], loading: 'idle' } as ProductsState

export const fetchProducts = createAsyncThunk<any>(
    'products/fetchProducts',
    async (thunkAPI) => {
        const response = await axios.all([
            axios.get('https://storage.yandexcloud.net/products-table/documents1.json'),
            axios.get('https://storage.yandexcloud.net/products-table/documents1.json'), 
        ]).then(axios.spread((result1, result2) => {
            return [...result1.data, ...result2.data]
        }));
        return response
    }
)

export const cleanProducts = createAsyncThunk(
    'products/cleanProducts',
    async (selected: string[], thunkAPI) => {
        const response = await axios.post('/clean', selected)
        return response.data
    }
)

const productsReducer = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = 'pending'
        })
        builder.addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = 'succeeded'
            state.products = action.payload
        })
        builder.addCase(fetchProducts.rejected, (state) => {
            state.loading = 'failed'
        })
    }
})

export default productsReducer.reducer;