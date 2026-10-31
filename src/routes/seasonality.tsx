import { createFileRoute } from "@tanstack/react-router";
import { SeasonalityView } from "@/components/intel/seasonality-view";

export const Route = createFileRoute("/seasonality")({ component: SeasonalityView });
