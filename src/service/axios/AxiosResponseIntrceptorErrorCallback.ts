import type { AxiosError } from 'axios'
import toast from '@/components/ui/toast'

const AxiosResponseIntrceptorErrorCallback = (error: AxiosError) => {
    /** handle response error here */
    console.error('error', error)
    
    // Handle 401 Unauthorized errors globally
    if (error.response?.status === 401) {
        toast.push(
            <div>
                <div className="font-semibold">Sesi Login Habis</div>
                <div>Sesi login anda sudah habis, silahkan logout dan login kembali</div>
            </div>,
            {
                title: 'Unauthorized',
                type: 'warning',
            }
        )
    }
}

export default AxiosResponseIntrceptorErrorCallback
