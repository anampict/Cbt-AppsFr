"use client";

import { useState, useCallback } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import DatePicker from "@/components/ui/DatePicker";
import { TbPlus } from "react-icons/tb";
import MaintenanceService from "@/service/MaintenanceService";
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

interface MaintenanceAddDialogProps {
  onSuccess?: () => void;
}

const MaintenanceAddDialog = ({ onSuccess }: MaintenanceAddDialogProps) => {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [sekolahOptions, setSekolahOptions] = useState<SekolahOption[]>([]);
  const [formData, setFormData] = useState({
    sekolahId: "",
    tanggalMulai: null as Date | null,
    keterangan: "",
  });

  const handleOpenDialog = () => {
    setDialogOpen(true);
    // Load initial sekolah list
    loadSekolahOptions("");
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      sekolahId: "",
      tanggalMulai: null,
      keterangan: "",
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

    if (!formData.sekolahId || !formData.tanggalMulai || !formData.keterangan) {
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
      const tanggalMulaiISO = formData.tanggalMulai
        ? formData.tanggalMulai.toISOString()
        : "";

      const payload = {
        sekolahId: formData.sekolahId,
        tanggalMulai: tanggalMulaiISO,
        keterangan: formData.keterangan,
      };

      console.log("Creating maintenance with payload:", payload);

      await MaintenanceService.createMaintenance(payload);

      toast.push(
        <Notification type="success">
          Maintenance berhasil ditambahkan!
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
      console.error("Error creating maintenance:", error);
      console.error("Error response:", error.response?.data);

      let errorMessage = "Gagal menambahkan maintenance!";

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
      <Button
        variant="solid"
        size="sm"
        icon={<TbPlus />}
        onClick={handleOpenDialog}
      >
        Tambah Maintenance
      </Button>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        onRequestClose={handleCloseDialog}
        shouldCloseOnOverlayClick={!loading}
        shouldCloseOnEsc={!loading}
        width={600}
      >
        <h5 className="mb-4">Tambah Maintenance Baru</h5>
        <form onSubmit={handleSubmit}>
          <div className="mt-6 max-h-[500px] overflow-y-auto">
            <div className="grid grid-cols-1 gap-4">
              {/* Sekolah Select */}
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-semibold">
                  Sekolah <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="Pilih Sekolah"
                  options={sekolahOptions}
                  value={sekolahOptions.find(
                    (opt) => opt.value === formData.sekolahId
                  )}
                  onChange={(option) => {
                    if (option) {
                      setFormData({
                        ...formData,
                        sekolahId: option.value,
                      });
                    }
                  }}
                  onInputChange={handleSekolahSearch}
                  isLoading={searchLoading}
                  isSearchable
                  isClearable
                  isDisabled={loading}
                />
              </div>

              {/* Tanggal Mulai */}
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-semibold">
                  Tanggal Mulai <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  placeholder="Pilih Tanggal Mulai"
                  value={formData.tanggalMulai}
                  onChange={(date) => {
                    setFormData({
                      ...formData,
                      tanggalMulai: date,
                    });
                  }}
                  inputFormat="DD/MM/YYYY HH:mm"
                  disabled={loading}
                />
              </div>

              {/* Keterangan */}
              <div className="col-span-1">
                <label className="block mb-2 text-sm font-semibold">
                  Keterangan <span className="text-red-500">*</span>
                </label>
                <Input
                  textArea
                  placeholder="Masukkan keterangan maintenance"
                  value={formData.keterangan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      keterangan: e.target.value,
                    })
                  }
                  disabled={loading}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-6">
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

export default MaintenanceAddDialog;
