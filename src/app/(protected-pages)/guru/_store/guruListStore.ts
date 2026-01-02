import { create } from 'zustand'
import type { Guru } from '../types'

export type GuruListState = {
    initialLoading: boolean
    guruList: Guru[]
    selectedGuru: Partial<Guru>[]
}

type GuruListAction = {
    setGuruList: (guruList: Guru[]) => void
    setSelectedGuru: (checked: boolean, guru: Guru) => void
    setSelectAllGuru: (guru: Guru[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: GuruListState = {
    initialLoading: true,
    guruList: [],
    selectedGuru: [],
}

export const useGuruListStore = create<
    GuruListState & GuruListAction
>((set) => ({
    ...initialState,
    setSelectedGuru: (checked, row) =>
        set((state) => {
            const prevData = state.selectedGuru
            if (checked) {
                return { selectedGuru: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevGuru) => row.id === prevGuru.id)
                ) {
                    return {
                        selectedGuru: prevData.filter(
                            (prevGuru) => prevGuru.id !== row.id,
                        ),
                    }
                }
                return { selectedGuru: prevData }
            }
        }),
    setSelectAllGuru: (row) => set(() => ({ selectedGuru: row })),
    setGuruList: (guruList) => set(() => ({ guruList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
