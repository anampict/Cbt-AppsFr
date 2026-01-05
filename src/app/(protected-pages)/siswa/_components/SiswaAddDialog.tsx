"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Upload from "@/components/ui/Upload";
import { TbPlus, TbSearch, TbUpload } from "react-icons/tb";
import SiswaService from "@/service/SiswaService";
import KelasService from "@/service/KelasService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import debounce from "lodash/debounce";

interface KelasOption {
  label: string;
  value: string;
}

interface SiswaAddDialogProps {
  onSuccess?: () => void;
}

const SiswaAddDialog = ({ onSuccess }: SiswaAddDialogProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [kelasSearchLoading, setKelasSearchLoading] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<KelasOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nisn: "",
    nis: "",
    nama: "",
    email: "",
    password: "",
    telepon: "",
    alamat: "",
    tanggalLahir: "",
    jenisKelamin: "",
    kelasId: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    loadKelasOptions("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      nisn: "",
      nis: "",
      nama: "",
      email: "",
      password: "",
      telepon: "",
      alamat: "",
      tanggalLahir: "",
      jenisKelamin: "",
      kelasId: "",
    });
    setUploadedFile(null);
    setKelasOptions([]);
  };

  const loadKelasOptions = async (search: string) => {
    try {
      setKelasSearchLoading(true);
      const response = await KelasService.getKelasList({
        search,
        limit: 100,
      });

      const options = response.data.map((kelas) => ({
        label: `${kelas.namaKelas}`,
        value: kelas.id,
      }));

      setKelasOptions(options);
    } catch (error: any) {
      console.error("Error loading kelas:", error);
      toast.push(
        <Notification type="danger">
          Gagal memuat data kelas:{" "}
          {error.response?.data?.message || error.message}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setKelasSearchLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedKelasSearch = useCallback(
    debounce((search: string) => {
      loadKelasOptions(search);
    }, 500),
    []
  );

  const handleKelasSearch = (inputValue: string) => {
    debouncedKelasSearch(inputValue);
  };

  const handleFileChange = (files: File[]) => {
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nisn ||
      !formData.nis ||
      !formData.nama ||
      !formData.email ||
      !formData.password ||
      !formData.telepon ||
      !formData.alamat ||
      !formData.tanggalLahir ||
      !formData.jenisKelamin ||
      !formData.kelasId
    ) {
      toast.push(
        <Notification type="warning">Semua field harus diisi!</Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append("nisn", formData.nisn);
      submitData.append("nis", formData.nis);
      submitData.append("nama", formData.nama);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("telepon", formData.telepon);
      submitData.append("alamat", formData.alamat);
      submitData.append("tanggalLahir", formData.tanggalLahir);
      submitData.append("jenisKelamin", formData.jenisKelamin);
      submitData.append("kelasId", formData.kelasId);

      if (uploadedFile) {
        submitData.append("foto", uploadedFile);
      }

      await SiswaService.createSiswa(submitData);

      toast.push(
        <Notification type="success">Siswa berhasil ditambahkan!</Notification>,
        {
          placement: "top-center",
        }
      );

      handleCloseDialog();

      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error creating siswa:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menambahkan siswa!"}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="solid"
        size="sm"
        icon={<TbPlus />}
        onClick={handleOpenDialog}
      >
        Tambah Siswa
      </Button>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={700}
      >
        <h5 className="mb-4">Tambah Siswa</h5>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Foto Siswa
              </label>
              <Upload
                onChange={handleFileChange}
                accept="image/*"
                uploadLimit={1}
                disabled={loading}
              >
                <Button
                  type="button"
                  icon={<TbUpload />}
                  disabled={loading}
                  block
                >
                  {uploadedFile ? uploadedFile.name : "Upload Foto"}
                </Button>
              </Upload>
              <p className="text-xs text-gray-500 mt-1">
                Format: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  NISN <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan NISN"
                  value={formData.nisn}
                  onChange={(e) =>
                    setFormData({ ...formData, nisn: e.target.value })
                  }
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  NIS <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  placeholder="Masukkan NIS"
                  value={formData.nis}
                  onChange={(e) =>
                    setFormData({ ...formData, nis: e.target.value })
                  }
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.nama}
                onChange={(e) =>
                  setFormData({ ...formData, nama: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                placeholder="Masukkan email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <Input
                type="password"
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Telepon <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan nomor telepon"
                value={formData.telepon}
                onChange={(e) =>
                  setFormData({ ...formData, telepon: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Alamat <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan alamat lengkap"
                value={formData.alamat}
                onChange={(e) =>
                  setFormData({ ...formData, alamat: e.target.value })
                }
                disabled={loading}
                textArea
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.tanggalLahir}
                onChange={(e) =>
                  setFormData({ ...formData, tanggalLahir: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Pilih jenis kelamin..."
                options={[
                  { label: "Laki-laki", value: "L" },
                  { label: "Perempuan", value: "P" },
                ]}
                value={
                  formData.jenisKelamin
                    ? {
                        label:
                          formData.jenisKelamin === "L"
                            ? "Laki-laki"
                            : "Perempuan",
                        value: formData.jenisKelamin,
                      }
                    : null
                }
                onChange={(option: any) => {
                  setFormData({
                    ...formData,
                    jenisKelamin: option?.value || "",
                  });
                }}
                isDisabled={loading}
              />
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Kelas <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Pilih kelas..."
                options={kelasOptions}
                value={
                  kelasOptions.find((opt) => opt.value === formData.kelasId) ||
                  null
                }
                onChange={(option: any) => {
                  setFormData({
                    ...formData,
                    kelasId: option?.value || "",
                  });
                }}
                onInputChange={handleKelasSearch}
                isLoading={kelasSearchLoading}
                isDisabled={loading}
                isSearchable
                components={{
                  DropdownIndicator: () => (
                    <div className="mr-2">
                      <TbSearch />
                    </div>
                  ),
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ketik untuk mencari kelas
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="plain"
              onClick={handleCloseDialog}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              Simpan
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default SiswaAddDialog;
