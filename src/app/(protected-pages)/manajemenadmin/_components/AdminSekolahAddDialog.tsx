"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { TbPlus, TbSearch } from "react-icons/tb";
import AdminSekolahService from "@/service/AdminSekolahService";
import SekolahService, { type SekolahResponse } from "@/service/SekolahService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import debounce from "lodash/debounce";

interface SekolahOption {
  label: string;
  value: string;
  npsn?: string;
}

interface AdminSekolahAddDialogProps {
  onSuccess?: () => void;
}

const AdminSekolahAddDialog = ({ onSuccess }: AdminSekolahAddDialogProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sekolahOptions, setSekolahOptions] = useState<SekolahOption[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN_SEKOLAH",
    sekolahId: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    // Load initial sekolah list
    loadSekolahOptions("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "ADMIN_SEKOLAH",
      sekolahId: "",
    });
    setSekolahOptions([]);
  };

  const loadSekolahOptions = async (search: string) => {
    try {
      setSearchLoading(true);
      const response = await SekolahService.getListSekolah({
        search,
        limit: 50,
      });

      const options = response.data.map((sekolah: SekolahResponse) => ({
        label: `${sekolah.nama} (${sekolah.npsn})`,
        value: sekolah.id,
        npsn: sekolah.npsn,
      }));

      setSekolahOptions(options);
    } catch (error: any) {
      console.error("Error loading sekolah:", error);
      toast.push(
        <Notification type="danger">
          Gagal memuat data sekolah:{" "}
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

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      loadSekolahOptions(search);
    }, 500),
    []
  );

  const handleSekolahSearch = (inputValue: string) => {
    debouncedSearch(inputValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.sekolahId
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
      await AdminSekolahService.createAdminSekolah(formData);

      toast.push(
        <Notification type="success">
          Admin sekolah berhasil ditambahkan!
        </Notification>,
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
      console.error("Error creating admin sekolah:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal menambahkan admin sekolah!"}
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
        Tambah Admin Sekolah
      </Button>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={600}
      >
        <h5 className="mb-4">Tambah Admin Sekolah</h5>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Masukkan nama lengkap"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                Sekolah <span className="text-red-500">*</span>
              </label>
              <Select
                placeholder="Pilih sekolah..."
                options={sekolahOptions}
                value={sekolahOptions.find(
                  (opt) => opt.value === formData.sekolahId
                )}
                onChange={(option) =>
                  setFormData({
                    ...formData,
                    sekolahId: (option as SekolahOption)?.value || "",
                  })
                }
                onInputChange={handleSekolahSearch}
                isLoading={searchLoading}
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
                Ketik untuk mencari sekolah berdasarkan nama atau NPSN
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
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

export default AdminSekolahAddDialog;
