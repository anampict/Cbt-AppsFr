import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import GuruListProvider from "./_components/GuruListProvider";
import GuruListTable from "./_components/GuruListTable";
import GuruListActionTools from "./_components/GuruListActionTools";
import GuruListTableTools from "./_components/GuruListTableTools";
import GuruListSelected from "./_components/GuruListSelected";
import { getGuruList } from "@/server/actions/getGuruList";
import type { PageProps } from "@/@types/common";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getGuruList(params);

  return (
    <GuruListProvider guruList={data.gurus}>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Daftar Guru</h3>
              <GuruListActionTools />
            </div>
            <GuruListTableTools />
            <GuruListTable
              guruListTotal={data.total}
              pageIndex={data.pageIndex}
              pageSize={data.pageSize}
            />
          </div>
        </AdaptiveCard>
      </Container>
      <GuruListSelected />
    </GuruListProvider>
  );
}
