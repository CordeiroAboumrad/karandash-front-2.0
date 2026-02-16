import { version } from "../../../package.json";
import karandashLogo from "../../assets/karandash.png";

import styles from "./Footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.kFooter}>
      <div>
        <div>
          <div className={styles.footerImage}>
            <a
              href="http://www.acessoainformacao.gov.br/"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={karandashLogo} alt="link acesso informacao" />
            </a>
          </div>
          <text className={styles.versionInfo}>
            Versão: Frontend: {version}
          </text>
        </div>
      </div>
    </footer>
  );
};
