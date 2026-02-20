import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import { Root } from "../layout/Root";
import { Home } from "../features/Home";
import { Login } from "../features/Login";
import { Artists } from "../features/Artists";
import { Customers } from "../features/Customers";
import { Products } from "../features/Products";
import { ProtectedRoute } from "./ProtectedRoute";
import { RegularRoutes } from "./routes";

export const AppRouter = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={RegularRoutes.LOGIN} element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Root />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path={RegularRoutes.HOME} element={<Home />} />
        <Route path={RegularRoutes.ARTISTS} element={<Artists />} />
        <Route path={RegularRoutes.CUSTOMERS} element={<Customers />} />
        <Route path={RegularRoutes.PRODUCTS} element={<Products />} />
      </Route>
    </>,
  ),
);
