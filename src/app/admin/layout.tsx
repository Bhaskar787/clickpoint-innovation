import { ConfirmDialogProvider } from "@/components/admin/confirm-dialog";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConfirmDialogProvider>{children}</ConfirmDialogProvider>;
}
