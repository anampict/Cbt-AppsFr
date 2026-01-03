"use client";

import { useState, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Upload from "@/components/ui/Upload";
import { TbSearch, TbUpload } from "react-icons/tb";
import GuruService, { type Guru } from "@/service/GuruService";
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

interface GuruEditDialogProps {
  guru: Guru;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const GuruEditDialog = ({
  guru,
  isOpen,
  onClose,
  onSuccess,
}: GuruEditDialogProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapelOptions, setMapelOptions] = useState<MapelOption[]>([]);
  const [kelasSearchLoading, setKelasSearchLoading] = useState(false);
  const [kelasOptions, setKelasOptions] = useState<KelasOption[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    nip: guru.nip,
    nama: guru.nama,
    email: guru.email,
    password: "",
    telepon: guru.telepon,
    alamat: guru.alamat,
    mapelIds: guru.mapel?.map((m: any) => m.id) || [],
    kelasIds: guru.kelas?.map((k: any) => k.id) || [],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        nip: guru.nip,
        nama: guru.nama,
        email: guru.email,
        password: "",
        telepon: guru.telepon,
        alamat: guru.alamat,
        mapelIds: guru.mapel?.map((m: any) => m.id) || [],
        kelasIds: guru.kelas?.map((k: any) => k.id) || [],
      });
      setUploadedFile(null);
      loadMapelOptions("");
      loadKelasOptions("");
    }
  }, [isOpen, guru]);

  const handleCloseDialog = () => {
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
    onClose();
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
    } finally {
      setKelasSearchLoading(false);
    }
  };

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
      !formData.telepon ||
      !formData.alamat
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

      // 1. Update data guru (dengan atau tanpa foto)
      let updateData: any;

      if (uploadedFile) {
        // Jika ada foto baru, kirim sebagai FormData
        const formDataToSend = new FormData();
        formDataToSend.append("nip", formData.nip);
        formDataToSend.append("nama", formData.nama);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("telepon", formData.telepon);
        formDataToSend.append("alamat", formData.alamat);
        formDataToSend.append("foto", uploadedFile);
        updateData = formDataToSend;
      } else {
        // Jika tidak ada foto, kirim sebagai JSON
        updateData = {
          nip: formData.nip,
          nama: formData.nama,
          email: formData.email,
          telepon: formData.telepon,
          alamat: formData.alamat,
        };
      }

      await GuruService.updateGuru(guru.id, updateData);

      // 2. Update mapel jika ada perubahan
      const currentMapelIds = guru.mapel?.map((m: any) => m.mapel.id) || [];
      const hasMapelChanged =
        formData.mapelIds.length !== currentMapelIds.length ||
        formData.mapelIds.some((id) => !currentMapelIds.includes(id));

      if (hasMapelChanged) {
        await GuruService.updateGuruMapel(guru.id, formData.mapelIds);
      }

      // 3. Update kelas jika ada perubahan
      const currentKelasIds =
        guru.kelas?.map((k: any) => k.kelas?.id || k.id) || [];
      const hasKelasChanged =
        formData.kelasIds.length !== currentKelasIds.length ||
        formData.kelasIds.some((id) => !currentKelasIds.includes(id));

      if (hasKelasChanged) {
        await GuruService.updateGuruKelas(guru.id, formData.kelasIds);
      }

      toast.push(
        <Notification type="success">Guru berhasil diupdate!</Notification>,
        {
          placement: "top-center",
        }
      );

      // Call onSuccess first to trigger refresh
      if (onSuccess) {
        onSuccess();
      }

      // Small delay to ensure backend has processed
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Then close dialog
      handleCloseDialog();

      // Final refresh
      router.refresh();
    } catch (error: any) {
      console.error("Error updating guru:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal mengupdate guru!"}
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
      <h5 className="mb-4">Edit Guru</h5>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <label className="block mb-2 text-sm font-medium">Foto Guru</label>
            {guru.fotoUrl && !uploadedFile && (
              <div className="mb-2">
                <img
                  src={guru.fotoUrl}
                  alt={guru.nama}
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
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
              Password Baru
            </label>
            <Input
              type="password"
              placeholder="Kosongkan jika tidak ingin mengubah password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Kosongkan jika tidak ingin mengubah password
            </p>
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
              Ketik untuk mencari mata pelajaran
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
            Update
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default GuruEditDialog;
