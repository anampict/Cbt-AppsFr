"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Upload from "@/components/ui/Upload";
import { TbPlus, TbSearch, TbUpload } from "react-icons/tb";
import GuruService from "@/service/GuruService";
import MapelService from "@/service/MapelService";
import KelasService from "@/service/KelasService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import debounce from "lodash/debounce";

interface MapelOption {
  label: string;
  value: string;
  kode?: string;
}

interface KelasOption {
  label: string;
  value: string;
}

interface GuruAddDialogProps {
  onSuccess?: () => void;
}

const GuruAddDialog = ({ onSuccess }: GuruAddDialogProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapelOptions, setMapelOptions] = useState<MapelOption[]>([]);
  const [kelasSearchLoading, setKelasSearchLoading] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<KelasOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nip: "",
    nama: "",
    email: "",
    password: "",
    telepon: "",
    alamat: "",
    mapelIds: [] as string[],
    kelasIds: [] as string[],
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    // Load initial mapel and kelas list
    loadMapelOptions("");
    loadKelasOptions("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      nip: "",
      nama: "",
      email: "",
      password: "",
      telepon: "",
      alamat: "",
      mapelIds: [],
      kelasIds: [],
    });
    setUploadedFile(null);
    setMapelOptions([]);
    setKelasOptions([]);
  };

  const loadMapelOptions = async (search: string) => {
    try {
      setSearchLoading(true);
      const response = await MapelService.getMapelList({
        search,
        limit: 100,
      });

      const options = response.data.map((mapel) => ({
        label: `${mapel.namaMapel} (${mapel.kodeMapel})`,
        value: mapel.id,
        kode: mapel.kodeMapel,
      }));

      setMapelOptions(options);
    } catch (error: any) {
      console.error("Error loading mapel:", error);
      toast.push(
        <Notification type="danger">
          Gagal memuat data mata pelajaran:{" "}
          {error.response?.data?.message || error.message}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setSearchLoading(false);
    }
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

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      loadMapelOptions(search);
    }, 500),
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedKelasSearch = useCallback(
    debounce((search: string) => {
      loadKelasOptions(search);
    }, 500),
    []
  );

  const handleMapelSearch = (inputValue: string) => {
    debouncedSearch(inputValue);
  };

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
      !formData.nip ||
      !formData.nama ||
      !formData.email ||
      !formData.password ||
      !formData.telepon ||
      !formData.alamat
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

      // Prepare form data for multipart upload
      const submitData = new FormData();
      submitData.append("nip", formData.nip);
      submitData.append("nama", formData.nama);
      submitData.append("email", formData.email);
      submitData.append("password", formData.password);
      submitData.append("telepon", formData.telepon);
      submitData.append("alamat", formData.alamat);

      // Add mapel ids as JSON string array
      if (formData.mapelIds.length > 0) {
        formData.mapelIds.forEach((mapelId) => {
          submitData.append("mapelIds[]", mapelId);
        });
      }

      // Add kelas ids as JSON string array
      if (formData.kelasIds.length > 0) {
        formData.kelasIds.forEach((kelasId) => {
          submitData.append("kelasIds[]", kelasId);
        });
      }

      // Add photo if uploaded
      if (uploadedFile) {
        submitData.append("foto", uploadedFile);
      }

      await GuruService.createGuru(submitData);

      toast.push(
        <Notification type="success">Guru berhasil ditambahkan!</Notification>,
        {
          placement: "top-center",
        }
      );

      handleCloseDialog();

      // Call onSuccess callback to refresh the table
      if (onSuccess) {
        onSuccess();
      }

      router.refresh();
    } catch (error: any) {
      console.error("Error creating guru:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menambahkan guru!"}
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
        Tambah Guru
      </Button>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={700}
      >
        <h5 className="mb-4">Tambah Guru</h5>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Foto Guru
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

            <div>
              <label className="block mb-2 text-sm font-medium">
                NIP <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan NIP"
                value={formData.nip}
                onChange={(e) =>
                  setFormData({ ...formData, nip: e.target.value })
                }
                disabled={loading}
              />
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
                Mata Pelajaran yang Diampu
              </label>
              <Select
                placeholder="Pilih mata pelajaran..."
                options={mapelOptions}
                value={mapelOptions.filter((opt) =>
                  formData.mapelIds.includes(opt.value)
                )}
                onChange={(options) => {
                  const selectedIds = Array.isArray(options)
                    ? options.map((opt) => opt.value)
                    : [];
                  setFormData({
                    ...formData,
                    mapelIds: selectedIds,
                  });
                }}
                onInputChange={handleMapelSearch}
                isLoading={searchLoading}
                isDisabled={loading}
                isSearchable
                isMulti
                components={{
                  DropdownIndicator: () => (
                    <div className="mr-2">
                      <TbSearch />
                    </div>
                  ),
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ketik untuk mencari mata pelajaran. Bisa memilih lebih dari
                satu.
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Kelas yang Diampu
              </label>
              <Select
                placeholder="Pilih kelas..."
                options={kelasOptions}
                value={kelasOptions.filter((opt) =>
                  formData.kelasIds.includes(opt.value)
                )}
                onChange={(options) => {
                  const selectedIds = Array.isArray(options)
                    ? options.map((opt) => opt.value)
                    : [];
                  setFormData({
                    ...formData,
                    kelasIds: selectedIds,
                  });
                }}
                onInputChange={handleKelasSearch}
                isLoading={kelasSearchLoading}
                isDisabled={loading}
                isSearchable
                isMulti
                components={{
                  DropdownIndicator: () => (
                    <div className="mr-2">
                      <TbSearch />
                    </div>
                  ),
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Ketik untuk mencari kelas. Bisa memilih lebih dari satu.
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

export default GuruAddDialog;
