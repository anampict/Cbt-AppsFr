import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import MapelListProvider from "./_components/MapelListProvider";
import MapelListTable from "./_components/MapelListTable";
import MapelListActionTools from "./_components/MapelListActionTools";
import MapelListTableTools from "./_components/MapelListTableTools";
import MapelListSelected from "./_components/MapelListSelected";
import { getMapelList } from "@/server/actions/getMapelList";
import type { PageProps } from "@/@types/common";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const data = await getMapelList(params);

  return (
    <MapelListProvider mapelList={data.mapels}>
      <Container>
        <AdaptiveCard>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <h3>Daftar Mata Pelajaran</h3>
              <MapelListActionTools />
            </div>
            <MapelListTableTools />
            <MapelListTable
              mapelListTotal={data.total}
              pageIndex={data.pageIndex}
              pageSize={data.pageSize}
            />
          </div>
        </AdaptiveCard>
      </Container>
      <MapelListSelected />
    </MapelListProvider>
  );
}
