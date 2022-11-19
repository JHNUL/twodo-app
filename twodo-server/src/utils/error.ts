import createError from '@fastify/error';

interface ErrorObj {
  message?: string;
  statusCode: number;
}

type ErrorKey =
  | 'FST_INVALID_USERNAME'
  | 'FST_INVALID_PASSWORD'
  | 'FST_REGISTER_USER_FAILURE'
  | 'FST_USER_LOGIN_FAILURE'
  | 'FST_USER_NOT_FOUND'
  | 'FST_UNAUTHORIZED';

type ErrorMap = { [key in ErrorKey]: ErrorObj };

const ERRORS: ErrorMap = {
  FST_INVALID_USERNAME: {
    message: 'Username must be 3-50 characters.',
    statusCode: 400,
  },
  FST_INVALID_PASSWORD: {
    message:
      'Password must be 8-20 characters with at least one special character.',
    statusCode: 400,
  },
  FST_REGISTER_USER_FAILURE: {
    message: 'Failed to register new user.',
    statusCode: 500,
  },
  FST_USER_LOGIN_FAILURE: {
    message: 'Failed to login user.',
    statusCode: 500,
  },
  FST_USER_NOT_FOUND: {
    message: 'User was not found.',
    statusCode: 400,
  },
  FST_UNAUTHORIZED: {
    message: 'Unauthorized',
    statusCode: 401,
  },
};

export const throwAppError = (
  appErrorCode: ErrorKey,
  appErrorMessage?: string
) => {
  const AppError = createError(
    appErrorCode,
    appErrorMessage ?? ERRORS[appErrorCode].message ?? 'Something went wrong.',
    ERRORS[appErrorCode].statusCode
  );
  throw new AppError();
};
