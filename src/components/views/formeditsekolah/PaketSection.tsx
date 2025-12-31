"use client";

import { useEffect, useState, useCallback } from "react";
import Card from "@/components/ui/Card";
import Select from "@/components/ui/Select";
import { FormItem } from "@/components/ui/Form";
import { Controller } from "react-hook-form";
import PaketService from "@/service/PaketService";
import toast from "@/components/ui/toast";
import Notification from "@/components/ui/Notification";
import debounce from "lodash/debounce";
import type { FormSectionBaseProps } from "./types";

type PaketSectionProps = FormSectionBaseProps;

interface PaketOption {
  label: string;
  value: string;
  nama?: string;
}

const PaketSection = ({ control, errors }: PaketSectionProps) => {
  const [paketOptions, setPaketOptions] = useState<PaketOption[]>([]);
  const [loadingPaket, setLoadingPaket] = useState(false);

  const loadPaketOptions = async (search: string = "") => {
    try {
      setLoadingPaket(true);
      const response = await PaketService.getListPaket({
        search,
        limit: 50,
      });

      const options = response.data.map((paket) => ({
        label: paket.namaPaket,
        value: paket.id,
        nama: paket.namaPaket,
      }));

      setPaketOptions(options);
    } catch (error: any) {
      console.error("Error loading paket:", error);
      toast.push(
        <Notification type="danger">
          Gagal memuat data paket:{" "}
          {error.response?.data?.message || error.message}
        </Notification>,
        {
          placement: "top-center",
        }
      );
    } finally {
      setLoadingPaket(false);
    }
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      loadPaketOptions(search);
    }, 500),
    []
  );

  const handlePaketSearch = (inputValue: string) => {
    debouncedSearch(inputValue);
  };

  useEffect(() => {
    // Load initial paket list
    loadPaketOptions("");
  }, []);

  return (
    <Card>
      <h4 className="mb-6">Pilih Paket</h4>
      <FormItem
        label="Paket Sekolah"
        invalid={Boolean(errors.paketId)}
        errorMessage={errors.paketId?.message}
      >
        <Controller
          name="paketId"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="Pilih paket..."
              options={paketOptions}
              value={paketOptions.find((opt) => opt.value === field.value)}
              onChange={(option) =>
                field.onChange((option as PaketOption)?.value || "")
              }
              onInputChange={handlePaketSearch}
              isLoading={loadingPaket}
              isSearchable
              isClearable
            />
          )}
        />
      </FormItem>
    </Card>
  );
};

export default PaketSection;
