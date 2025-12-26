"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import AdminSekolahService, {
  type AdminSekolahResponse,
} from "@/service/AdminSekolahService";
import SekolahService, { type SekolahResponse } from "@/service/SekolahService";
import type { AdminSekolahData } from "@/server/actions/getAdminSekolah";
import { TbArrowLeft, TbSearch } from "react-icons/tb";
import debounce from "lodash/debounce";

interface SekolahOption {
  label: string;
  value: string;
  npsn?: string;
}

interface AdminSekolahEditFormProps {
  admin: AdminSekolahData;
}

const AdminSekolahEditForm = ({ admin }: AdminSekolahEditFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sekolahOptions, setSekolahOptions] = useState<SekolahOption[]>([]);
  const [formData, setFormData] = useState({
    name: admin.name,
    email: admin.email,
    password: "",
    sekolahId: admin.sekolahId,
  });

  const handleBack = () => {
    router.push("/manajemenadmin");
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

      // Add current sekolah if not in results
      if (
        admin.sekolah &&
        !options.find((opt: SekolahOption) => opt.value === admin.sekolahId)
      ) {
        setSekolahOptions([
          {
            label: `${admin.sekolah.nama} (${admin.sekolah.npsn})`,
            value: admin.sekolahId,
            npsn: admin.sekolah.npsn,
          },
          ...options,
        ]);
      }
    } catch (error: any) {
      console.error("Error loading sekolah:", error);
    } finally {
      setSearchLoading(false);
    }
  };

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

  // Load initial sekolah options
  useState(() => {
    loadSekolahOptions("");
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.sekolahId) {
      toast.push(
        <Notification type="warning">
          Nama, email, dan sekolah harus diisi!
        </Notification>,
        {
          placement: "top-center",
        }
      );
      return;
    }

    try {
      setLoading(true);
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        sekolahId: formData.sekolahId,
      };

      // Only include password if it's not empty
      if (formData.password) {
        updateData.password = formData.password;
      }

      await AdminSekolahService.updateAdminSekolah(admin.id, updateData);

      toast.push(
        <Notification type="success">
          Admin sekolah berhasil diperbarui!
        </Notification>,
        {
          placement: "top-center",
        }
      );

      router.push("/manajemenadmin");
      router.refresh();
    } catch (error: any) {
      console.error("Error updating admin sekolah:", error);
      toast.push(
        <Notification type="danger">
          {error.response?.data?.message || "Gagal memperbarui admin sekolah!"}
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
      <div className="mb-6 flex items-center gap-3">
        <Button
          size="sm"
          variant="plain"
          icon={<TbArrowLeft />}
          onClick={handleBack}
        >
          Kembali
        </Button>
        <h3 className="text-xl font-bold">Edit Admin Sekolah</h3>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
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
                Password (Kosongkan jika tidak ingin mengubah)
              </label>
              <Input
                type="password"
                placeholder="Masukkan password baru"
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

          <div className="flex justify-end gap-3 mt-8">
            <Button
              type="button"
              variant="plain"
              onClick={handleBack}
              disabled={loading}
            >
              Batal
            </Button>
            <Button type="submit" variant="solid" loading={loading}>
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </Card>
    </>
  );
};

export default AdminSekolahEditForm;
