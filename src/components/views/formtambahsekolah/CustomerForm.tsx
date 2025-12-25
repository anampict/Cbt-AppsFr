"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/Form";
import Container from "@/components/shared/Container";
import BottomStickyBar from "@/components/template/BottomStickyBar";
import OverviewSection from "./OverviewSection";
import AddressSection from "./AddressSection";
import ProfileImageSection from "./ProfileImageSection";
import AccountSection from "./AccountSection";
import isEmpty from "lodash/isEmpty";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { CommonProps } from "@/@types/common";
import type { CustomerFormSchema } from "./types";

type CustomerFormProps = {
  onFormSubmit: (values: CustomerFormSchema) => void;
  defaultValues?: CustomerFormSchema;
  newCustomer?: boolean;
} & CommonProps;

const validationSchema = z.object({
  npsn: z.string().min(1, { message: "NPSN harus diisi" }),
  nama: z.string().min(1, { message: "Nama sekolah harus diisi" }),
  email: z
    .string()
    .min(1, { message: "Email harus diisi" })
    .email({ message: "Format email tidak valid" }),
  telepon: z.string().min(1, { message: "Nomor telepon harus diisi" }),
  provinsi: z.string().min(1, { message: "Provinsi harus diisi" }),
  alamat: z.string().min(1, { message: "Alamat harus diisi" }),
  kota: z.string().min(1, { message: "Kota harus diisi" }),
  logo: z.any().optional(),
  tags: z.array(z.object({ value: z.string(), label: z.string() })).optional(),
  banAccount: z.boolean().optional(),
  accountVerified: z.boolean().optional(),
});

const CustomerForm = (props: CustomerFormProps) => {
  const {
    onFormSubmit,
    defaultValues = {},
    newCustomer = false,
    children,
  } = props;

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<CustomerFormSchema>({
    defaultValues: {
      ...{
        banAccount: false,
        accountVerified: true,
      },
      ...defaultValues,
    },
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    if (!isEmpty(defaultValues)) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultValues)]);

  const onSubmit = (values: CustomerFormSchema) => {
    onFormSubmit?.(values);
  };

  return (
    <Form
      className="flex w-full h-full"
      containerClassName="flex flex-col w-full justify-between"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Container>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="gap-4 flex flex-col flex-auto">
            <OverviewSection control={control} errors={errors} />
            <AddressSection control={control} errors={errors} />
          </div>
          <div className="md:w-[370px] gap-4 flex flex-col">
            <ProfileImageSection control={control} errors={errors} />
          </div>
        </div>
      </Container>
      <BottomStickyBar>{children}</BottomStickyBar>
    </Form>
  );
};

export default CustomerForm;
