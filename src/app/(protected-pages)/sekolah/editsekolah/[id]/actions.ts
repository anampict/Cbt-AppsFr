'use server'

import { revalidatePath } from 'next/cache'

export async function revalidateSekolahPages() {
    // Revalidate halaman list sekolah dengan semua layout
    revalidatePath('/sekolah', 'layout')
    
    // Revalidate semua halaman detail sekolah
    revalidatePath('/sekolah/detailsekolah', 'layout')
    
    // Revalidate semua halaman edit sekolah  
    revalidatePath('/sekolah/editsekolah', 'layout')
}
