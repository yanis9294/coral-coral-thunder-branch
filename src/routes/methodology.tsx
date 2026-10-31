import { createFileRoute } from "@tanstack/react-router";
import { MethodologyView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/methodology")({ component: MethodologyView });
