import DashboardLayout from "@/components/layouts/dashboard";
import { Suspense, lazy, useMemo } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/home/page"));
const ServerPage = lazy(() => import("@/pages/servers/page"));
const ViewServerPage = lazy(() => import("@/pages/servers/view/page"));

const router = createBrowserRouter([
  {
    Component: DashboardLayout,
    children: [
      { index: true, Component: HomePage },
      {
        path: "servers",
        children: [
          {
            index: true,
            Component: ServerPage,
          },
          {
            path: ":id",
            Component: ViewServerPage,
          },
        ],
      },
    ],
  },
]);

const Router = () => {
  const routerData = useMemo(() => {
    return router;
  }, []);

  return (
    <Suspense>
      <RouterProvider router={routerData} />
    </Suspense>
  );
};

export default Router;
