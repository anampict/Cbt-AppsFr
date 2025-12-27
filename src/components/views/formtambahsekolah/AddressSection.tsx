"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import AutoComplete from "@/components/shared/AutoComplete";
import { FormItem } from "@/components/ui/Form";
import { Controller, useWatch } from "react-hook-form";
import WilayahService from "@/service/WilayahService";
import type { FormSectionBaseProps } from "./types";
import type { Provinsi, Kota, Kecamatan } from "@/service/WilayahService";

type AddressSectionProps = FormSectionBaseProps;

const AddressSection = ({ control, errors }: AddressSectionProps) => {
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [kotaList, setKotaList] = useState<Kota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [provinsiLoading, setProvinsiLoading] = useState(false);
  const [kotaLoading, setKotaLoading] = useState(false);
  const [kecamatanLoading, setKecamatanLoading] = useState(false);
  const [selectedProvinsiKode, setSelectedProvinsiKode] = useState<string>("");
  const [selectedKotaKode, setSelectedKotaKode] = useState<string>("");

  // Refs untuk simpan onChange handlers dari hidden fields
  const provinsiKodeOnChange = useRef<((value: string) => void) | null>(null);
  const kotaKodeOnChange = useRef<((value: string) => void) | null>(null);
  const kecamatanKodeOnChange = useRef<((value: string) => void) | null>(null);

  // Watch for provinsi and kota changes
  const provinsiValue = useWatch({
    control,
    name: "provinsi",
  });

  const kotaValue = useWatch({
    control,
    name: "kota",
  });

  // Fetch provinsi list when searching
  const handleProvinsiSearch = async (search: string) => {
    if (search.length < 2) {
      setProvinsiList([]);
      return;
    }

    setProvinsiLoading(true);
    try {
      const response = await WilayahService.getProvinsi(search, 10);
      setProvinsiList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching provinsi:", error);
      setProvinsiList([]);
    } finally {
      setProvinsiLoading(false);
    }
  };

  // Fetch kota list when searching
  const handleKotaSearch = async (search: string) => {
    console.log(
      "handleKotaSearch dipanggil - search:",
      search,
      "selectedProvinsiKode:",
      selectedProvinsiKode
    );

    if (!selectedProvinsiKode || search.length < 2) {
      console.log(
        "Kota search dibatalkan - provinsiKode:",
        selectedProvinsiKode,
        "search length:",
        search.length
      );
      setKotaList([]);
      return;
    }

    setKotaLoading(true);
    try {
      console.log(
        "Fetching kota dengan provinsiKode:",
        selectedProvinsiKode,
        "search:",
        search
      );
      const response = await WilayahService.getKota(
        selectedProvinsiKode,
        search,
        10
      );
      console.log("Kota response:", response.data);
      setKotaList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching kota:", error);
      setKotaList([]);
    } finally {
      setKotaLoading(false);
    }
  };

  // Fetch kecamatan list when searching
  const handleKecamatanSearch = async (search: string) => {
    if (!selectedKotaKode || search.length < 2) {
      setKecamatanList([]);
      return;
    }

    setKecamatanLoading(true);
    try {
      const response = await WilayahService.getKecamatan(
        selectedKotaKode,
        search,
        10
      );
      setKecamatanList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching kecamatan:", error);
      setKecamatanList([]);
    } finally {
      setKecamatanLoading(false);
    }
  };

  // Reset kota when provinsi changes
  useEffect(() => {
    if (!provinsiValue) {
      setSelectedProvinsiKode("");
      setKotaList([]);
      setSelectedKotaKode("");
      setKecamatanList([]);
    }
  }, [provinsiValue]);

  // Reset kecamatan when kota changes
  useEffect(() => {
    if (!kotaValue) {
      setSelectedKotaKode("");
      setKecamatanList([]);
    }
  }, [kotaValue]);

  return (
    <Card>
      <h4 className="mb-6">Alamat dan Lokasi</h4>

      {/* Hidden fields untuk kode wilayah */}
      <Controller
        name="provinsiKode"
        control={control}
        render={({ field }) => {
          provinsiKodeOnChange.current = field.onChange;
          return <input type="hidden" {...field} />;
        }}
      />
      <Controller
        name="kotaKode"
        control={control}
        render={({ field }) => {
          kotaKodeOnChange.current = field.onChange;
          return <input type="hidden" {...field} />;
        }}
      />
      <Controller
        name="kecamatanKode"
        control={control}
        render={({ field }) => {
          kecamatanKodeOnChange.current = field.onChange;
          return <input type="hidden" {...field} />;
        }}
      />

      <FormItem
        label="Provinsi"
        invalid={Boolean(errors.provinsi)}
        errorMessage={errors.provinsi?.message}
      >
        <Controller
          name="provinsi"
          control={control}
          render={({ field }) => (
            <AutoComplete<Provinsi>
              data={provinsiList}
              optionKey={(provinsi) => provinsi.nama}
              value={field.value || ""}
              onInputChange={(value) => {
                field.onChange(value);
                // Reset provinsi kode jika value kosong
                if (!value) {
                  setSelectedProvinsiKode("");
                }
                handleProvinsiSearch(value);
              }}
              onOptionSelected={(provinsi) => {
                // Set nama provinsi
                field.onChange(provinsi.nama);
                // Set kode provinsi ke hidden field
                console.log(
                  "Provinsi dipilih:",
                  provinsi.nama,
                  "Kode:",
                  provinsi.kode
                );
                provinsiKodeOnChange.current?.(provinsi.kode);
                setSelectedProvinsiKode(provinsi.kode);
                console.log(
                  "selectedProvinsiKode setelah di-set:",
                  provinsi.kode
                );
                setProvinsiList([]);
              }}
              renderOption={(provinsi) => (
                <div>
                  <div className="font-semibold">{provinsi.nama}</div>
                  <div className="text-xs text-gray-500">
                    Kode: {provinsi.kode}
                  </div>
                </div>
              )}
              placeholder="Ketik untuk mencari provinsi..."
            />
          )}
        />
      </FormItem>
      <FormItem
        label="Kota/Kabupaten"
        invalid={Boolean(errors.kota)}
        errorMessage={errors.kota?.message}
      >
        <Controller
          name="kota"
          control={control}
          render={({ field }) => (
            <AutoComplete<Kota>
              data={kotaList}
              optionKey={(kota) => kota.nama}
              value={field.value || ""}
              onInputChange={(value) => {
                field.onChange(value);
                // Reset kota kode jika value kosong
                if (!value) {
                  setSelectedKotaKode("");
                }
                handleKotaSearch(value);
              }}
              onOptionSelected={(kota) => {
                // Set nama kota
                field.onChange(kota.nama);
                // Set kode kota ke hidden field
                kotaKodeOnChange.current?.(kota.kode);
                setSelectedKotaKode(kota.kode);
                setKotaList([]);
              }}
              renderOption={(kota) => (
                <div>
                  <div className="font-semibold">{kota.nama}</div>
                  <div className="text-xs text-gray-500">Kode: {kota.kode}</div>
                </div>
              )}
              placeholder={
                selectedProvinsiKode
                  ? "Ketik untuk mencari kota/kabupaten..."
                  : "Pilih provinsi terlebih dahulu"
              }
              disabled={!selectedProvinsiKode}
            />
          )}
        />
      </FormItem>
      <FormItem
        label="Kecamatan"
        invalid={Boolean(errors.kecamatan)}
        errorMessage={errors.kecamatan?.message}
      >
        <Controller
          name="kecamatan"
          control={control}
          render={({ field }) => (
            <AutoComplete<Kecamatan>
              data={kecamatanList}
              optionKey={(kecamatan) => kecamatan.nama}
              value={field.value || ""}
              onInputChange={(value) => {
                field.onChange(value);
                handleKecamatanSearch(value);
              }}
              onOptionSelected={(kecamatan) => {
                // Set nama kecamatan
                field.onChange(kecamatan.nama);
                // Set kode kecamatan ke hidden field
                kecamatanKodeOnChange.current?.(kecamatan.kode);
                setKecamatanList([]);
              }}
              renderOption={(kecamatan) => (
                <div>
                  <div className="font-semibold">{kecamatan.nama}</div>
                  <div className="text-xs text-gray-500">
                    Kode: {kecamatan.kode}
                  </div>
                </div>
              )}
              placeholder={
                selectedKotaKode
                  ? "Ketik untuk mencari kecamatan..."
                  : "Pilih kota terlebih dahulu"
              }
              disabled={!selectedKotaKode}
            />
          )}
        />
      </FormItem>
      <FormItem
        label="Alamat Lengkap"
        invalid={Boolean(errors.alamat)}
        errorMessage={errors.alamat?.message}
      >
        <Controller
          name="alamat"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Desa/Kelurahan)"
              {...field}
            />
          )}
        />
      </FormItem>
    </Card>
  );
};

export default AddressSection;
