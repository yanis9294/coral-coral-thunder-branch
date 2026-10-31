import { createFileRoute } from "@tanstack/react-router";
import { TrendView } from "@/components/intel/trend-view";

export const Route = createFileRoute("/trend")({ component: TrendView });
