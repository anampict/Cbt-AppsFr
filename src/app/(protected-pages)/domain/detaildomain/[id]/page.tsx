import DomainDetails from "./_components/DomainDetails";
import NoUserFound from "@/assets/svg/NoUserFound";
import { getDomain } from "@/server/actions/getDomain";
import isEmpty from "lodash/isEmpty";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const data = await getDomain(params);

  if (isEmpty(data)) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <NoUserFound height={280} width={280} />
        <h2 className="mt-4">Domain tidak ditemukan!</h2>
      </div>
    );
  }

  return <DomainDetails data={data} />;
}
