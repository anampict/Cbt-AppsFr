import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import MaintenanceListContent from "./_components/MaintenanceListContent";

export default async function Page() {
  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3>Daftar Maintenance</h3>
              <p className="text-sm text-gray-500 mt-1">
                Kelola jadwal maintenance untuk setiap sekolah
              </p>
            </div>
          </div>
          <MaintenanceListContent />
        </div>
      </AdaptiveCard>
    </Container>
  );
}
