import {
  createHashRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Root } from "../layout/Root";
import { Home } from "../features/Home";
import { HOME } from "./routes";

export const AppRouter = createHashRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path={HOME} element={<Home />} />
    </Route>,
  ),
);
