"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Dialog from "@/components/ui/Dialog";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Form, FormItem } from "@/components/ui/Form";
import { useCustomerListStore } from "../_store/customerListStore";
import useAppendQueryParams from "@/utils/hooks/useAppendQueryParams";
import { TbFilter } from "react-icons/tb";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormSchema = {
  provinsi: string;
  kota: string;
};

const provinsiList = [
  { label: "Aceh", value: "Aceh" },
  { label: "Bali", value: "Bali" },
  { label: "Bangka Belitung", value: "Bangka Belitung" },
  { label: "Banten", value: "Banten" },
  { label: "Bengkulu", value: "Bengkulu" },
  { label: "DI Yogyakarta", value: "DI Yogyakarta" },
  { label: "DKI Jakarta", value: "DKI Jakarta" },
  { label: "Gorontalo", value: "Gorontalo" },
  { label: "Jambi", value: "Jambi" },
  { label: "Jawa Barat", value: "Jawa Barat" },
  { label: "Jawa Tengah", value: "Jawa Tengah" },
  { label: "Jawa Timur", value: "Jawa Timur" },
  { label: "Kalimantan Barat", value: "Kalimantan Barat" },
  { label: "Kalimantan Selatan", value: "Kalimantan Selatan" },
  { label: "Kalimantan Tengah", value: "Kalimantan Tengah" },
  { label: "Kalimantan Timur", value: "Kalimantan Timur" },
  { label: "Kalimantan Utara", value: "Kalimantan Utara" },
  { label: "Kepulauan Riau", value: "Kepulauan Riau" },
  { label: "Lampung", value: "Lampung" },
  { label: "Maluku", value: "Maluku" },
  { label: "Maluku Utara", value: "Maluku Utara" },
  { label: "Nusa Tenggara Barat", value: "Nusa Tenggara Barat" },
  { label: "Nusa Tenggara Timur", value: "Nusa Tenggara Timur" },
  { label: "Papua", value: "Papua" },
  { label: "Papua Barat", value: "Papua Barat" },
  { label: "Riau", value: "Riau" },
  { label: "Sulawesi Barat", value: "Sulawesi Barat" },
  { label: "Sulawesi Selatan", value: "Sulawesi Selatan" },
  { label: "Sulawesi Tengah", value: "Sulawesi Tengah" },
  { label: "Sulawesi Tenggara", value: "Sulawesi Tenggara" },
  { label: "Sulawesi Utara", value: "Sulawesi Utara" },
  { label: "Sumatera Barat", value: "Sumatera Barat" },
  { label: "Sumatera Selatan", value: "Sumatera Selatan" },
  { label: "Sumatera Utara", value: "Sumatera Utara" },
];

const validationSchema = z.object({
  provinsi: z.string(),
  kota: z.string(),
});

const CustomerListTableFilter = () => {
  const [dialogIsOpen, setIsOpen] = useState(false);

  const filterData = useCustomerListStore((state) => state.filterData);
  const setFilterData = useCustomerListStore((state) => state.setFilterData);

  const { onAppendQueryParams } = useAppendQueryParams();

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const { handleSubmit, reset, control, watch } = useForm<FormSchema>({
    defaultValues: {
      provinsi: (filterData as any)?.provinsi || "",
      kota: (filterData as any)?.kota || "",
    },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (values: FormSchema) => {
    onAppendQueryParams({
      provinsi: values.provinsi,
      kota: values.kota,
    });

    setFilterData({
      ...filterData,
      provinsi: values.provinsi,
      kota: values.kota,
    });
    setIsOpen(false);
  };

  const handleResetFilter = () => {
    reset({
      provinsi: "",
      kota: "",
    });
    onAppendQueryParams({
      provinsi: "",
      kota: "",
    });
    setFilterData({
      ...filterData,
      provinsi: "",
      kota: "",
    });
  };

  return (
    <>
      <Button icon={<TbFilter />} onClick={() => openDialog()}>
        Filter
      </Button>
      <Dialog
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h4 className="mb-4">Filter Sekolah</h4>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormItem label="Provinsi">
            <Controller
              name="provinsi"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Pilih Provinsi"
                  options={provinsiList}
                  {...field}
                />
              )}
            />
          </FormItem>
          <FormItem label="Kota">
            <Controller
              name="kota"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  autoComplete="off"
                  placeholder="Cari berdasarkan kota"
                  {...field}
                />
              )}
            />
          </FormItem>
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button type="button" onClick={handleResetFilter}>
              Reset
            </Button>
            <Button type="submit" variant="solid">
              Apply
            </Button>
          </div>
        </Form>
      </Dialog>
    </>
  );
};

export default CustomerListTableFilter;
