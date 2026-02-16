import axios from "axios";
import type { AxiosError } from "axios";

import {
  type ApiAbstractError,
  ApiAuthorizationError,
  ApiImoResponseError,
  ApiTicketError,
  ApiUnexpectedError,
} from "./errorTypes";
import type { ApiErrorData } from "./errorTypes";

const ResponseErrorMap: Record<
  number,
  (e: AxiosError<ApiErrorData>) => ApiAbstractError
> = {
  403: (e) => new ApiAuthorizationError(e),
  422: (e) => new ApiImoResponseError(e),
  500: (e) => new ApiTicketError(e),
};

export const apiErrorHandler = (err: unknown) => {
  if (!axios.isAxiosError(err)) {
    return new ApiUnexpectedError().handleRedirect();
  }

  if (err.response) {
    const handler =
      ResponseErrorMap[err.response.status](err) || new ApiUnexpectedError();

    handler.handleError();
    handler.handleAction();
    handler.handleRedirect();

    throw err;
  }
};
