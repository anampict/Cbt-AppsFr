import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import SiswaListProvider from "./_components/SiswaListProvider";
import SiswaListTable from "./_components/SiswaListTable";
import SiswaListActionTools from "./_components/SiswaListActionTools";
import SiswaListTableTools from "./_components/SiswaListTableTools";
import SiswaListSelected from "./_components/SiswaListSelected";
import { getSiswaList } from "@/server/actions/getSiswaList";
import type { PageProps } from "@/@types/common";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getSiswaList(params);

  return (
    <SiswaListProvider siswaList={data.siswas}>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Daftar Siswa</h3>
              <SiswaListActionTools />
            </div>
            <SiswaListTableTools />
            <SiswaListTable
              siswaListTotal={data.total}
              pageIndex={data.pageIndex}
              pageSize={data.pageSize}
            />
          </div>
        </AdaptiveCard>
      </Container>
      <SiswaListSelected />
    </SiswaListProvider>
  );
}
