import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import CustomerListProvider from "./_components/CustomerListProvider";
import CustomerListTable from "./_components/CustomerListTable";
import CustomerListActionTools from "./_components/CustomerListActionTools";
import CustomersListTableTools from "./_components/CustomersListTableTools";
import CustomerListSelected from "./_components/CustomerListSelected";
import { getSekolahList } from "@/server/actions/getSekolahList";
import type { PageProps } from "@/@types/common";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getSekolahList(params);

  return (
    <CustomerListProvider customerList={data.customers}>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Daftar Sekolah</h3>
              <CustomerListActionTools />
            </div>
            <CustomersListTableTools />
            <CustomerListTable
              customerListTotal={data.total}
              pageIndex={data.pageIndex}
              pageSize={data.pageSize}
            />
          </div>
        </AdaptiveCard>
      </Container>
      <CustomerListSelected />
    </CustomerListProvider>
  );
}
