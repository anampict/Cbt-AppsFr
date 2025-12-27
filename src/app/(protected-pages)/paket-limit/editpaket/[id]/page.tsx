import Container from "@/components/shared/Container";
import PaketEditForm from "./_components/PaketEditForm";

export default async function PaketEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Container>
      <PaketEditForm paketId={id} />
    </Container>
  );
}
