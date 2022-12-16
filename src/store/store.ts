import { configureStore } from '@reduxjs/toolkit'
import productsReducer from '../reducers/productsReducer'

const store = configureStore({
    reducer: {
        products: productsReducer
    },
    devTools: true
})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store