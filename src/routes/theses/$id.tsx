import { createFileRoute } from "@tanstack/react-router";
import { ThesisDetail } from "@/components/intel/theses-view";

export const Route = createFileRoute("/theses/$id")({
  component: ThesisDetailPage,
});

function ThesisDetailPage() {
  const { id } = Route.useParams();
  return <ThesisDetail id={id} />;
}
