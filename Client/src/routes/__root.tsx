import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Header from "../components/header";
import Footer from "../components/footer";
import { Box } from "@mui/material";

export const Route = createRootRoute({
  // notFoundComponent: <div></div>,
  component: () => (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Outlet />
        </Box>
        <Footer />
      </Box>
      <TanStackRouterDevtools />
    </>
  ),
});
