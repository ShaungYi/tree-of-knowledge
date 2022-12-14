import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    treeScale: 0.7,
    bushResourceIconScale: 1,
    subBushResourceIconScale: 0.5
}

const scaleSlice = createSlice({
    name:'scale',
    initialState,
    reducers: {
        setTreeScale(state, action) {
            state.treeScale = action.payload
        },
        
    }
})

export default scaleSlice

