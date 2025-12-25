"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { FormItem } from "@/components/ui/Form";
import { Controller } from "react-hook-form";
import type { FormSectionBaseProps } from "./types";

type AddressSectionProps = FormSectionBaseProps;

const AddressSection = ({ control, errors }: AddressSectionProps) => {
  return (
    <Card>
      <h4 className="mb-6">Alamat dan Lokasi</h4>
      <FormItem
        label="Provinsi"
        invalid={Boolean(errors.provinsi)}
        errorMessage={errors.provinsi?.message}
      >
        <Controller
          name="provinsi"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Provinsi"
              {...field}
            />
          )}
        />
      </FormItem>
      <FormItem
        label="Alamat"
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
              placeholder="Alamat"
              {...field}
            />
          )}
        />
      </FormItem>
      <FormItem
        label="Kota"
        invalid={Boolean(errors.kota)}
        errorMessage={errors.kota?.message}
      >
        <Controller
          name="kota"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Kota"
              {...field}
            />
          )}
        />
      </FormItem>
    </Card>
  );
};

export default AddressSection;
