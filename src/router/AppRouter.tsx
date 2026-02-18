import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Root } from "../layout/Root";
import { Home } from "../features/Home";

import { RegularRoutes } from "./routes";
import { Artists } from "../features/Artists";
import { Customers } from "../features/Customers";

export const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route index element={<Home />} />
      <Route path={RegularRoutes.HOME} element={<Home />} />

      <Route path={RegularRoutes.ARTISTS} element={<Artists />} />
      <Route path={RegularRoutes.CUSTOMERS} element={<Customers />} />
    </Route>,
  ),
);
