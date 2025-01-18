import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface Props {
  pageIcon: LucideIcon;
  pageTitle: string;
  children: ReactNode;
}

export default function PageShell({
  pageIcon: PageIcon,
  pageTitle,
  children,
}: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="border-b border-b-gray-300 p-4">
        <div className="mx-auto flex max-w-screen-2xl items-center">
          <PageIcon color="#4b5563" size={20} strokeWidth={1.5} />
          <h1 className="ml-3 text-lg font-semibold tracking-tight text-gray-900">
            {pageTitle}
          </h1>
        </div>
      </header>
      <main className="flex-1 bg-gray-100 p-4">
        <div className="mx-auto max-w-screen-2xl">{children}</div>
      </main>
    </div>
  );
}
