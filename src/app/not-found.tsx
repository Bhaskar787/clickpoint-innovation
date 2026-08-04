import { getNotFoundPage } from "@/server/actions/not-found";
import NotFoundClientView from "./not-found-client-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NotFound() {
  const content = await getNotFoundPage();
  return <NotFoundClientView content={content} />;
}