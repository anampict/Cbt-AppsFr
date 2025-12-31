import Overview from "./_components/Overview";
import LoginSuccessToast from "./_components/LoginSuccessToast";
import { auth } from "@/auth";

export default async function Page() {
  const session = await auth();
  const isAdminSekolah = session?.user?.role === "ADMIN_SEKOLAH";

  return (
    <div>
      <LoginSuccessToast />
      <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
        {isAdminSekolah ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Halo Admin</h1>
              <p className="text-lg text-gray-600">
                Selamat datang di sistem CBT
              </p>
            </div>
          </div>
        ) : (
          <Overview />
        )}
      </div>
    </div>
  );
}
