import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import KelasListProvider from "./_components/KelasListProvider";
import KelasListTable from "./_components/KelasListTable";
import KelasListActionTools from "./_components/KelasListActionTools";
import KelasListTableTools from "./_components/KelasListTableTools";
import KelasListSelected from "./_components/KelasListSelected";
import { getKelasList } from "@/server/actions/getKelasList";
import type { PageProps } from "@/@types/common";

export const dynamic = "force-dynamic";

export default async function KelasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getKelasList(params);

  return (
    <KelasListProvider kelasList={data.kelas}>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Daftar Kelas</h3>
              <KelasListActionTools />
            </div>
            <KelasListTableTools />
            <KelasListTable
              kelasListTotal={data.total}
              pageIndex={data.pageIndex}
              pageSize={data.pageSize}
            />
          </div>
        </AdaptiveCard>
      </Container>
      <KelasListSelected />
    </KelasListProvider>
  );
}
