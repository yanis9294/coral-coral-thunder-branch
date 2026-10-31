import { createFileRoute } from "@tanstack/react-router";
import { FxView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/fx")({ component: FxView });
