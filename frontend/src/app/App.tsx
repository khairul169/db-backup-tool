import { QueryClientProvider } from "react-query";
import Router from "./Router";
import { queryClient } from "@/lib/queryClient";
import { lazy } from "react";
import "./global.css";

const Toaster = lazy(() => import("@/components/ui/sonner"));
const ConfirmDialog = lazy(
  () => import("@/components/containers/confirm-dialog")
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster richColors />
      <ConfirmDialog />
    </QueryClientProvider>
  );
};

export default App;
