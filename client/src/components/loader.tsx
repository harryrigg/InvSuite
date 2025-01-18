import { LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
