import { create } from 'zustand'
import type { Mapel } from '../types'

export type MapelListState = {
    initialLoading: boolean
    mapelList: Mapel[]
    selectedMapel: Partial<Mapel>[]
}

type MapelListAction = {
    setMapelList: (mapelList: Mapel[]) => void
    setSelectedMapel: (checked: boolean, mapel: Mapel) => void
    setSelectAllMapel: (mapel: Mapel[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: MapelListState = {
    initialLoading: true,
    mapelList: [],
    selectedMapel: [],
}

export const useMapelListStore = create<
    MapelListState & MapelListAction
>((set) => ({
    ...initialState,
    setSelectedMapel: (checked, row) =>
        set((state) => {
            const prevData = state.selectedMapel
            if (checked) {
                return { selectedMapel: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevMapel) => row.id === prevMapel.id)
                ) {
                    return {
                        selectedMapel: prevData.filter(
                            (prevMapel) => prevMapel.id !== row.id,
                        ),
                    }
                }
                return { selectedMapel: prevData }
            }
        }),
    setSelectAllMapel: (row) => set(() => ({ selectedMapel: row })),
    setMapelList: (mapelList) => set(() => ({ mapelList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
