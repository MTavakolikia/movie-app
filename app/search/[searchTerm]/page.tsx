import { redirect } from "next/navigation";

/* Old /search/[term] URLs now belong to the query-based search page. */

export default async function LegacySearchRedirect({
  params,
}: {
  params: Promise<{ searchTerm: string }>;
}) {
  const { searchTerm } = await params;
  redirect(`/search?q=${encodeURIComponent(searchTerm)}`);
}
