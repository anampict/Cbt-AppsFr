"use client";

import { useState, useCallback, useEffect } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Switcher from "@/components/ui/Switcher";
import DatePicker from "@/components/ui/DatePicker";
import { TbSearch } from "react-icons/tb";
import DomainService from "@/service/DomainService";
import SekolahService, { type SekolahResponse } from "@/service/SekolahService";
import { useRouter } from "next/navigation";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import debounce from "lodash/debounce";
import type { Domain } from "../types";

interface SekolahOption {
  label: string;
  value: string;
  npsn?: string;
}

interface DomainEditDialogProps {
  domain: Domain;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

const DomainEditDialog = ({
  domain,
  onSuccess,
  trigger,
}: DomainEditDialogProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sekolahOptions, setSekolahOptions] = useState<SekolahOption[]>([]);
  const [formData, setFormData] = useState({
    domain: domain.domain,
    customDomain: domain.customDomain,
    sslEnabled: domain.sslEnabled,
    isActive: domain.isActive,
    expiredAt: domain.expiredAt ? new Date(domain.expiredAt) : null,
    sekolahId: domain.sekolahId,
  });

  useEffect(() => {
    if (dialogOpen) {
      loadSekolahOptions("");
    }
  }, [dialogOpen]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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

    if (!formData.domain || !formData.customDomain || !formData.expiredAt) {
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

      // Convert Date to ISO format
      const expiredAtISO = formData.expiredAt
        ? formData.expiredAt.toISOString()
        : "";

      // Note: sekolahId tidak bisa diubah, hanya untuk create
      const payload = {
        domain: formData.domain,
        customDomain: formData.customDomain,
        sslEnabled: formData.sslEnabled,
        isActive: formData.isActive,
        expiredAt: expiredAtISO,
      };

      console.log("Updating domain with payload:", payload);

      await DomainService.updateDomain(domain.id, payload);

      toast.push(
        <Notification type="success">Domain berhasil diupdate!</Notification>,
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
      console.error("Error updating domain:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Gagal mengupdate domain!";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.push(<Notification type="danger">{errorMessage}</Notification>, {
        placement: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        <div onClick={handleOpenDialog}>{trigger}</div>
      ) : (
        <Button variant="solid" size="sm" onClick={handleOpenDialog}>
          Edit
        </Button>
      )}

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={600}
      >
        <h5 className="mb-4">Edit Domain</h5>
        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
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
                isDisabled={true}
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
                Sekolah tidak dapat diubah setelah domain dibuat
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Domain <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: smk-negeri-1-wonorejo"
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Domain utama (subdomain dari aplikasi)
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Custom Domain <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="Contoh: ujian.smkn1wonorejo.sch.id"
                value={formData.customDomain}
                onChange={(e) =>
                  setFormData({ ...formData, customDomain: e.target.value })
                }
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Domain kustom untuk sekolah
              </p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Tanggal Expired <span className="text-red-500">*</span>
              </label>
              <DatePicker
                value={formData.expiredAt}
                onChange={(date) =>
                  setFormData({ ...formData, expiredAt: date })
                }
                disabled={loading}
                inputFormat="DD MMM YYYY HH:mm"
                placeholder="Pilih tanggal expired"
              />
              <p className="text-xs text-gray-500 mt-1">
                Tanggal dan waktu domain akan expired
              </p>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <label className="block text-sm font-medium">SSL Enabled</label>
                <p className="text-xs text-gray-500 mt-1">
                  Aktifkan SSL untuk domain ini
                </p>
              </div>
              <Switcher
                checked={formData.sslEnabled}
                onChange={(checked) =>
                  setFormData({ ...formData, sslEnabled: checked })
                }
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <label className="block text-sm font-medium">
                  Status Aktif
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Aktifkan atau nonaktifkan domain
                </p>
              </div>
              <Switcher
                checked={formData.isActive}
                onChange={(checked) =>
                  setFormData({ ...formData, isActive: checked })
                }
                disabled={loading}
              />
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
              Update
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default DomainEditDialog;
