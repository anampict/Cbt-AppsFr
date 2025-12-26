import { notFound } from "next/navigation";
import Container from "@/components/shared/Container";
import AdminSekolahEditForm from "./_components/AdminSekolahEditForm";
import getAdminSekolah from "@/server/actions/getAdminSekolah";
import NoUserFound from "@/assets/svg/NoUserFound";

export default async function AdminSekolahEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const admin = await getAdminSekolah({ id });

  if (!admin) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <NoUserFound height={280} width={280} />
        <h2 className="mt-4">Admin tidak ditemukan!</h2>
      </div>
    );
  }

  return (
    <Container>
      <AdminSekolahEditForm admin={admin} />
    </Container>
  );
}
