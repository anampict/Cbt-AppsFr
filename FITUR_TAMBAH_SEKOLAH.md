# Fitur Tambah Sekolah - Dokumentasi

## Ringkasan
Fitur ini memungkinkan pengguna untuk menambahkan sekolah baru melalui form yang terhubung langsung dengan API backend.

## File-File yang Telah Dimodifikasi

### 1. **Form Component**
- [CustomerForm.tsx](src/components/views/formtambahsekolah/CustomerForm.tsx)
  - Mengupdate validasi schema dengan field sekolah (npsn, nama, email, telepon, provinsi, alamat, kota, logo)
  - Menghapus TagsSection dan AccountSection yang tidak diperlukan

### 2. **Form Sections**
- [OverviewSection.tsx](src/components/views/formtambahsekolah/OverviewSection.tsx)
  - Input fields: NPSN, Nama Sekolah, Email, Nomor Telepon
  - Label dalam bahasa Indonesia

- [AddressSection.tsx](src/components/views/formtambahsekolah/AddressSection.tsx)
  - Input fields: Provinsi, Alamat, Kota
  - Label dalam bahasa Indonesia

- [ProfileImageSection.tsx](src/components/views/formtambahsekolah/ProfileImageSection.tsx)
  - File upload untuk logo sekolah
  - Preview gambar
  - Support format: JPEG, PNG

### 3. **Types**
- [types.ts](src/components/views/formtambahsekolah/types.ts)
  - Updated CustomerFormSchema dengan field sekolah
  - Field logo dapat berupa File atau string

### 4. **Main Component**
- [CustomerCreate.tsx](src/app/protected-pages/sekolah/tambahsekolah/_components/CustomerCreate.tsx)
  - Menghubungkan form dengan SekolahService
  - Handle submit form dengan validasi
  - Upload file logo menggunakan FormData
  - Toast notification untuk success/error

### 5. **API Service**
- **File baru**: [SekolahService.ts](src/service/SekolahService.ts)
  - `createSekolah()` - Membuat sekolah baru dengan file upload
  - `getListSekolah()` - Mendapatkan daftar sekolah
  - `getSekolahDetail()` - Mendapatkan detail sekolah
  - `updateSekolah()` - Update data sekolah
  - `deleteSekolah()` - Hapus sekolah

### 6. **API Configuration**
- [api.config.ts](src/configs/api.config.ts)
  - Menambahkan endpoint sekolah:
    - `/sekolah/create` - Create
    - `/sekolah/list` - List
    - `/sekolah/{id}` - Detail
    - `/sekolah/{id}` - Update
    - `/sekolah/{id}` - Delete

## Flow Data

```
User Input (Form)
    ↓
CustomerCreate (Component)
    ↓
CustomerForm (Form Validation dengan Zod)
    ↓
SekolahService.createSekolah() (API Call)
    ↓
API Backend (/api/sekolah/create)
    ↓
Response & Toast Notification
    ↓
Redirect ke halaman /sekolah
```

## Validasi Form

Semua field adalah required:
- **NPSN**: Minimal 1 karakter
- **Nama Sekolah**: Minimal 1 karakter
- **Email**: Format email valid
- **Nomor Telepon**: Minimal 1 karakter
- **Provinsi**: Minimal 1 karakter
- **Alamat**: Minimal 1 karakter
- **Kota**: Minimal 1 karakter
- **Logo**: Optional, format JPEG/PNG

## API Request Format

Menggunakan `FormData` untuk upload file:
```json
{
  "npsn": "20512352",
  "nama": "SMA Negeri 3 Pasuruan",
  "alamat": "Jl. Kota No. 1",
  "kota": "Pasuruan",
  "provinsi": "Jawa timur",
  "telepon": "021-12345678",
  "email": "sma3@pasuruan.sch.id",
  "logo": <file>
}
```

## API Response Success (201/200)

```json
{
  "message": "Sekolah berhasil ditambahkan",
  "data": {
    "id": "b319257f-97de-4ffa-a345-6f9310a2b836",
    "npsn": "20512352",
    "nama": "SMA Negeri 3 Pasuruan",
    "alamat": "Jl. Kota No. 1",
    "kota": "Pasuruan",
    "provinsi": "Jawa timur",
    "telepon": "021-12345678",
    "email": "sma3@pasuruan.sch.id",
    "createdAt": "2025-12-25T14:52:37.115Z",
    "updatedAt": "2025-12-25T14:52:37.115Z",
    "logoUrl": "/uploads/logos/1766674357106-607435394.jpg"
  }
}
```

## Error Handling

Jika ada error saat submit:
- Toast notification "Gagal menambahkan sekolah!" ditampilkan
- Form tetap terbuka agar user bisa memperbaiki
- Log error di console untuk debugging

## User Experience

1. User membuka halaman tambah sekolah
2. Form menampilkan input fields yang clear dengan label dalam bahasa Indonesia
3. User mengisi semua field dan upload logo
4. User klik tombol "Simpan"
5. Form melakukan validasi
6. Jika valid, data dikirim ke API dengan loader pada button
7. Jika success:
   - Toast "Sekolah berhasil ditambahkan!" muncul
   - Redirect ke halaman daftar sekolah setelah 800ms
8. Jika error:
   - Toast "Gagal menambahkan sekolah!" muncul
   - User bisa retry

## Fitur Tambahan (Optional)

- Button "Batal" untuk pembatalan dengan konfirmasi dialog
- Preview image sebelum upload
- Validasi format file (JPEG/PNG only)
- Error messages yang spesifik untuk setiap field

## Integrasi dengan Backend

Pastikan backend API sudah siap dengan:
1. Endpoint: `POST /api/sekolah/create`
2. Accept: `multipart/form-data`
3. Return format sesuai response di atas
4. Handle file upload dan simpan ke storage
5. Generate dan return `logoUrl` path

## Testing Checklist

- [ ] Form validation bekerja (test dengan field kosong)
- [ ] File upload bekerja (test dengan image JPEG/PNG)
- [ ] API integration bekerja (test dengan valid data)
- [ ] Error handling bekerja (test dengan invalid API response)
- [ ] Redirect bekerja setelah success
- [ ] Cancel dialog bekerja
- [ ] Toast notifications muncul dengan benar
