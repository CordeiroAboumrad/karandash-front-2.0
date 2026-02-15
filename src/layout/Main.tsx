import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const Main = () => {
  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>
  );
};
