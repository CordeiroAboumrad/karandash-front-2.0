import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import styles from "./Root.module.css";

import { Main } from "./Main";

export const Root = () => {
  return (
    <div className={styles.root}>
      <Header />
      <Main />
      <Footer />
    </div>
  );
};
