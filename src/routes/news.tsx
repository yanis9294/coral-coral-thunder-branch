import { createFileRoute } from "@tanstack/react-router";
import { NewsView } from "@/components/intel/calculated-views";

export const Route = createFileRoute("/news")({ component: NewsView });
