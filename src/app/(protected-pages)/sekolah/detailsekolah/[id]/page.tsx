import CustomerDetails from "./_components/CustomerDetails";
import NoUserFound from "@/assets/svg/NoUserFound";
import { getSekolah } from "@/server/actions/getSekolah";
import isEmpty from "lodash/isEmpty";

export const dynamic = "force-dynamic";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const data = await getSekolah(params);

  if (isEmpty(data)) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <NoUserFound height={280} width={280} />
        <h2 className="mt-4">No customer found!</h2>
      </div>
    );
  }

  return <CustomerDetails data={data} />;
}
