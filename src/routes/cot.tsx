import { createFileRoute } from "@tanstack/react-router";
import { CotView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/cot")({ component: CotView });
