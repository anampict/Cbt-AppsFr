"use client";

import { useState, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Upload from "@/components/ui/Upload";
import { TbSearch, TbUpload } from "react-icons/tb";
import SiswaService from "@/service/SiswaService";
import KelasService from "@/service/KelasService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import debounce from "lodash/debounce";
import type { Siswa } from "../types";

interface KelasOption {
  label: string;
  value: string;
}

interface SiswaEditDialogProps {
  siswa: Siswa;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SiswaEditDialog = ({
  siswa,
  isOpen,
  onClose,
  onSuccess,
}: SiswaEditDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [kelasSearchLoading, setKelasSearchLoading] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<KelasOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nisn: siswa.nisn,
    nis: siswa.nis,
    nama: siswa.nama,
    email: siswa.email,
    telepon: siswa.telepon,
    alamat: siswa.alamat,
    tanggalLahir: siswa.tanggalLahir?.split("T")[0] || "",
    jenisKelamin: siswa.jenisKelamin,
    kelasId: siswa.kelasId,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nisn: siswa.nisn,
        nis: siswa.nis,
        nama: siswa.nama,
        email: siswa.email,
        telepon: siswa.telepon,
        alamat: siswa.alamat,
        tanggalLahir: siswa.tanggalLahir?.split("T")[0] || "",
        jenisKelamin: siswa.jenisKelamin,
        kelasId: siswa.kelasId,
      });
      setUploadedFile(null);
      loadKelasOptions("");
    }
  }, [isOpen, siswa]);

  const handleCloseDialog = () => {
    setFormData({
      nisn: "",
      nis: "",
      nama: "",
      email: "",
      telepon: "",
      alamat: "",
      tanggalLahir: "",
      jenisKelamin: "",
      kelasId: "",
    });
    setUploadedFile(null);
    setKelasOptions([]);
    onClose();
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
      !formData.telepon ||
      !formData.alamat ||
      !formData.tanggalLahir ||
      !formData.jenisKelamin ||
      !formData.kelasId
    ) {
      toast.push(
        <Notification type="warning">Field wajib harus diisi!</Notification>,
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
      submitData.append("telepon", formData.telepon);
      submitData.append("alamat", formData.alamat);
      submitData.append("tanggalLahir", formData.tanggalLahir);
      submitData.append("jenisKelamin", formData.jenisKelamin);
      submitData.append("kelasId", formData.kelasId);

      if (uploadedFile) {
        submitData.append("foto", uploadedFile);
      }

      await SiswaService.updateSiswa(siswa.id, submitData);

      toast.push(
        <Notification type="success">Siswa berhasil diupdate!</Notification>,
        {
          placement: "top-center",
        }
      );

      if (onSuccess) {
        onSuccess();
      }

      await new Promise((resolve) => setTimeout(resolve, 100));

      handleCloseDialog();
      router.refresh();
    } catch (error: any) {
      console.error("Error updating siswa:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal mengupdate siswa!"}
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
    <Dialog
      isOpen={isOpen}
      onClose={handleCloseDialog}
      onRequestClose={handleCloseDialog}
      shouldCloseOnOverlayClick={!loading}
      shouldCloseOnEsc={!loading}
      width={700}
    >
      <h5 className="mb-4">Edit Siswa</h5>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block mb-2 text-sm font-medium">Foto Siswa</label>
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
                {uploadedFile ? uploadedFile.name : "Upload Foto Baru"}
              </Button>
            </Upload>
            {siswa.fotoUrl && !uploadedFile && (
              <p className="text-xs text-gray-500 mt-1">
                Foto saat ini: {siswa.fotoUrl.split("/").pop()}
              </p>
            )}
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
            Update
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default SiswaEditDialog;
