import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: {
    id: string;
  };
}

export default function IndustryDetailPage({ params }: PageProps) {
  redirect(`/portfolio/${params.id}`);
}
