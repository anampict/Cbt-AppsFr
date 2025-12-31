"use client";

import { useEffect } from "react";
import { Form } from "@/components/ui/Form";
import Container from "@/components/shared/Container";
import BottomStickyBar from "@/components/template/BottomStickyBar";
import OverviewSection from "./OverviewSection";
import AddressSection from "./AddressSection";
import PaketSection from "./PaketSection";
import ProfileImageSection from "./ProfileImageSection";
import isEmpty from "lodash/isEmpty";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
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
  kelurahanKode: z.string().min(1, { message: "Wilayah harus diisi" }),
  alamatLengkap: z.string().min(1, { message: "Alamat lengkap harus diisi" }),
  wilayahLabel: z.string().optional(),
  paketId: z.string().optional(),
  logo: z.union([z.instanceof(File), z.string()]).optional(),
});

const CustomerForm = (props: CustomerFormProps) => {
  const {
    onFormSubmit,
    defaultValues = {},
    newCustomer = false,
    children,
  } = props;

  const methods = useForm<CustomerFormSchema>({
    defaultValues: defaultValues,
    resolver: zodResolver(validationSchema),
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = methods;

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
    <FormProvider {...methods}>
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
              <PaketSection control={control} errors={errors} />
            </div>
            <div className="md:w-[370px] gap-4 flex flex-col">
              <ProfileImageSection control={control} errors={errors} />
            </div>
          </div>
        </Container>
        <BottomStickyBar>{children}</BottomStickyBar>
      </Form>
    </FormProvider>
  );
};

export default CustomerForm;
