import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";
import PaketDetailContent from "./_components/PaketDetailContent";
import NoUserFound from "@/assets/svg/NoUserFound";

export default async function PaketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // TODO: Implement getPaket server action
  // For now, we'll use a placeholder
  // const paket = await getPaket({ id });

  // Temporary: fetch from client side will be handled in the component

  return (
    <Container>
      <PaketDetailContent paketId={id} />
    </Container>
  );
}
