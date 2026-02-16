import { APP_EXTERNAL } from "../data/config/external"

/*
  Força redirecionamento de url, para remover parâmetros indesejados que
  o componente 'HashRouter' da lib 'React Router' não consegue manipular.
*/
export const redirectTo = (route: string) => {
  let url = APP_EXTERNAL.FRONTEND_INDEX
  if (route) {
    url += `/#${route}`
  }
  window.location.href = url
}
