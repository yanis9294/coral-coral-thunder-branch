import { createFileRoute } from "@tanstack/react-router";
import { MicroView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/micro")({ component: MicroView });
