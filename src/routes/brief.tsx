import { createFileRoute } from "@tanstack/react-router";
import { BriefView } from "@/components/intel/brief-view";

export const Route = createFileRoute("/brief")({ component: BriefView });
