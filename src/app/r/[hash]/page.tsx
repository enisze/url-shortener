import { redirect } from "next/navigation";
import { getOriginalUrl } from "../../../lib/actions";

export default async function RedirectPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;
  const url = await getOriginalUrl(hash);
  if (url) {
    redirect(url);
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
        <p className="text-gray-600">
          The shortened URL you clicked is invalid or has expired.
        </p>
      </div>
    </div>
  );
}
