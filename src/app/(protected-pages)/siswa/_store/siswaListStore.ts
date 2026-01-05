import { create } from 'zustand'
import type { Siswa } from '../types'

export type SiswaListState = {
    initialLoading: boolean
    siswaList: Siswa[]
    selectedSiswa: Partial<Siswa>[]
}

type SiswaListAction = {
    setSiswaList: (siswaList: Siswa[]) => void
    setSelectedSiswa: (checked: boolean, siswa: Siswa) => void
    setSelectAllSiswa: (siswa: Siswa[]) => void
    setInitialLoading: (payload: boolean) => void
}

const initialState: SiswaListState = {
    initialLoading: true,
    siswaList: [],
    selectedSiswa: [],
}

export const useSiswaListStore = create<
    SiswaListState & SiswaListAction
>((set) => ({
    ...initialState,
    setSelectedSiswa: (checked, row) =>
        set((state) => {
            const prevData = state.selectedSiswa
            if (checked) {
                return { selectedSiswa: [...prevData, ...[row]] }
            } else {
                if (
                    prevData.some((prevSiswa) => row.id === prevSiswa.id)
                ) {
                    return {
                        selectedSiswa: prevData.filter(
                            (prevSiswa) => prevSiswa.id !== row.id,
                        ),
                    }
                }
                return { selectedSiswa: prevData }
            }
        }),
    setSelectAllSiswa: (row) => set(() => ({ selectedSiswa: row })),
    setSiswaList: (siswaList) => set(() => ({ siswaList })),
    setInitialLoading: (payload) => set(() => ({ initialLoading: payload })),
}))
