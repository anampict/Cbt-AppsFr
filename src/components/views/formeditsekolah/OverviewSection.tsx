"use client";

import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { FormItem } from "@/components/ui/Form";
import { Controller } from "react-hook-form";
import type { FormSectionBaseProps } from "./types";

type OverviewSectionProps = FormSectionBaseProps;

const OverviewSection = ({ control, errors }: OverviewSectionProps) => {
  return (
    <Card>
      <h4 className="mb-6">Informasi Sekolah</h4>
      <div className="grid md:grid-cols-2 gap-4">
        <FormItem
          label="NPSN"
          invalid={Boolean(errors.npsn)}
          errorMessage={errors.npsn?.message}
        >
          <Controller
            name="npsn"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Nomor NPSN"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Nama Sekolah"
          invalid={Boolean(errors.nama)}
          errorMessage={errors.nama?.message}
        >
          <Controller
            name="nama"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder="Nama Sekolah"
                {...field}
              />
            )}
          />
        </FormItem>
      </div>
      <FormItem
        label="Email"
        invalid={Boolean(errors.email)}
        errorMessage={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              type="email"
              autoComplete="off"
              placeholder="Email"
              {...field}
            />
          )}
        />
      </FormItem>
      <FormItem
        label="Nomor Telepon"
        invalid={Boolean(errors.telepon)}
        errorMessage={errors.telepon?.message}
      >
        <Controller
          name="telepon"
          control={control}
          render={({ field }) => (
            <Input
              type="text"
              autoComplete="off"
              placeholder="Nomor Telepon"
              {...field}
            />
          )}
        />
      </FormItem>
    </Card>
  );
};

export default OverviewSection;
