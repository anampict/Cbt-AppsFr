import Container from "@/components/shared/Container";
import AdaptiveCard from "@/components/shared/AdaptiveCard";
import DomainListContent from "./_components/DomainListContent";

export default async function Page() {
  return (
    <Container>
      <AdaptiveCard>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h3>Daftar Domain</h3>
              <p className="text-sm text-gray-500 mt-1">
                Kelola domain untuk setiap sekolah yang terdaftar
              </p>
            </div>
          </div>
          <DomainListContent />
        </div>
      </AdaptiveCard>
    </Container>
  );
}
