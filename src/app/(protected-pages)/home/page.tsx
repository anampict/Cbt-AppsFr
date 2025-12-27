import Overview from "./_components/Overview";
import LoginSuccessToast from "./_components/LoginSuccessToast";

export default async function Page() {
  return (
    <div>
      <LoginSuccessToast />
      <div className="flex flex-col gap-4 max-w-full overflow-x-hidden">
        <Overview />
      </div>
    </div>
  );
}
