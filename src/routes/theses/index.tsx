import { createFileRoute } from "@tanstack/react-router";
import { ThesesList } from "@/components/intel/theses-view";

export const Route = createFileRoute("/theses/")({ component: ThesesList });
