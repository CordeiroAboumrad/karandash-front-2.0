import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export const Main = () => {
  return (
    <main>
      <Suspense fallback={<div>Carregando...</div>}>
        <Outlet />
      </Suspense>
    </main>
  );
};
