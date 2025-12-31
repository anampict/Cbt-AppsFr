"use client";

import { useState, useCallback, useEffect } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { FormItem } from "@/components/ui/Form";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import WilayahService from "@/service/WilayahService";
import debounce from "lodash/debounce";
import type { FormSectionBaseProps } from "./types";
import type { WilayahAutocomplete } from "@/service/WilayahService";

type AddressSectionProps = FormSectionBaseProps;

interface WilayahOption {
  label: string;
  value: string;
  kode: string;
}

const AddressSection = ({ control, errors }: AddressSectionProps) => {
  const { setValue } = useFormContext();
  const [wilayahOptions, setWilayahOptions] = useState<WilayahOption[]>([]);
  const [wilayahLoading, setWilayahLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Watch kelurahanKode untuk load initial value
  const kelurahanKode = useWatch({
    control,
    name: "kelurahanKode",
  });

  // Load initial wilayah jika ada kelurahanKode
  useEffect(() => {
    if (kelurahanKode && !initialLoaded) {
      // Jika ada kode tapi belum ada di options, coba search dengan kode
      loadInitialWilayah(kelurahanKode);
      setInitialLoaded(true);
    }
  }, [kelurahanKode, initialLoaded]);

  const loadInitialWilayah = async (kode: string) => {
    try {
      // Search dengan kode untuk mendapatkan label
      const response = await WilayahService.autocomplete(kode, 5);
      if (response.data.data && response.data.data.length > 0) {
        const options = response.data.data.map(
          (wilayah: WilayahAutocomplete) => ({
            label: wilayah.label.replace(/>/g, ",").replace(/\s*,\s*/g, ", "),
            value: wilayah.kode,
            kode: wilayah.kode,
          })
        );
        setWilayahOptions(options);

        // Set wilayahLabel jika belum ada
        const matchedOption = options.find((opt) => opt.kode === kode);
        if (matchedOption) {
          setValue("wilayahLabel", matchedOption.label);
        }
      }
    } catch (error) {
      console.error("Error loading initial wilayah:", error);
    }
  };

  const loadWilayahOptions = async (search: string = "") => {
    if (search.length < 3) {
      setWilayahOptions([]);
      return;
    }

    try {
      setWilayahLoading(true);
      const response = await WilayahService.autocomplete(search, 20);
      const options = response.data.data.map(
        (wilayah: WilayahAutocomplete) => ({
          label: wilayah.label.replace(/>/g, ",").replace(/\s*,\s*/g, ", "),
          value: wilayah.kode,
          kode: wilayah.kode,
        })
      );
      setWilayahOptions(options);
    } catch (error) {
      console.error("Error loading wilayah:", error);
      setWilayahOptions([]);
    } finally {
      setWilayahLoading(false);
    }
  };

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((search: string) => {
      loadWilayahOptions(search);
    }, 300),
    []
  );

  const handleWilayahSearch = (inputValue: string) => {
    debouncedSearch(inputValue);
  };

  return (
    <Card>
      <h4 className="mb-6">Alamat dan Lokasi</h4>

      <FormItem
        label="Cari Wilayah (Kelurahan/Desa)"
        invalid={Boolean(errors.kelurahanKode)}
        errorMessage={errors.kelurahanKode?.message}
      >
        <Controller
          name="kelurahanKode"
          control={control}
          render={({ field }) => (
            <Select
              placeholder="Ketik minimal 3 karakter (nama kelurahan, kecamatan, kota)..."
              options={wilayahOptions}
              value={wilayahOptions.find((opt) => opt.value === field.value)}
              onChange={(option) => {
                const selectedOption = option as WilayahOption;
                field.onChange(selectedOption?.value || "");
                setValue("wilayahLabel", selectedOption?.label || "");
              }}
              onInputChange={handleWilayahSearch}
              isLoading={wilayahLoading}
              isSearchable
              isClearable
            />
          )}
        />
      </FormItem>

      <FormItem
        label="Alamat Lengkap"
        invalid={Boolean(errors.alamatLengkap)}
        errorMessage={errors.alamatLengkap?.message}
      >
        <Controller
          name="alamatLengkap"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Nomor Rumah, dll)"
              {...field}
            />
          )}
        />
      </FormItem>

      {/* Hidden field untuk wilayahLabel */}
      <Controller
        name="wilayahLabel"
        control={control}
        render={({ field }) => <input type="hidden" {...field} />}
      />
    </Card>
  );
};

export default AddressSection;
