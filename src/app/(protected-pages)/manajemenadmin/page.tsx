import Container from "@/components/shared/Container";
import AdminSekolahTable from "./_components/AdminSekolahTable";

export default async function Page() {
  return (
    <Container>
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Manajemen Admin Sekolah</h3>
            <p className="text-sm text-gray-500 mt-1">
              Kelola admin sekolah untuk setiap sekolah yang terdaftar
            </p>
          </div>
        </div>

        <AdminSekolahTable />
      </div>
    </Container>
  );
}
