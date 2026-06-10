import { RouteTransition } from "@/components/motion/RouteTransition";

export default function AppTemplate({ children }: { children: React.ReactNode }) {
  return <RouteTransition>{children}</RouteTransition>;
}
