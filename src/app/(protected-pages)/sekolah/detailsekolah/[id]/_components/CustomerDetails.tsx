"use client";

import Card from "@/components/ui/Card";
import ProfileSection from "./ProfileSection";
import type { Customer } from "../types";

type CustomerDetailsProps = {
  data: Customer;
};

const CustomerDetails = ({ data }: CustomerDetailsProps) => {
  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <div className="min-w-[330px] 2xl:min-w-[400px]">
        <ProfileSection data={data} />
      </div>
      <Card className="w-full">
        <div className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Informasi Sekolah
              </label>
              <div className="bg-gray-50 dark:bg-gray-800 rounded p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    NPSN:
                  </span>
                  <span className="font-semibold">{data.npsn || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Nama Sekolah:
                  </span>
                  <span className="font-semibold">{data.nama || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Email:
                  </span>
                  <span className="font-semibold">{data.email || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Telepon:
                  </span>
                  <span className="font-semibold">{data.telepon || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Alamat:
                  </span>
                  <span className="font-semibold">{data.alamat || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Kota:
                  </span>
                  <span className="font-semibold">{data.kota || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Provinsi:
                  </span>
                  <span className="font-semibold">{data.provinsi || "-"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerDetails;
