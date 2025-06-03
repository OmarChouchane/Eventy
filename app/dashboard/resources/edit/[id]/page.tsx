import { getResourceById } from "@/lib/actions/resource.actions";

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const resource = await getResourceById(params.id);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      ...
    </div>
  );
}
