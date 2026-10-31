import { createFileRoute } from "@tanstack/react-router";
import { MarketsView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/markets")({ component: MarketsView });
