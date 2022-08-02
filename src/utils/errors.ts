class InvalidCredentials extends Error {
  name = 'invalidCredentials'
  
  constructor(message: string) {
    super(message);
  }
}

class InvalidTokenAuthorization extends Error {
  name = 'invalidTokenAuthorization'

  constructor(message: string) {
    super(message);
  }
}

class UserAlreadyExists extends Error {
  name = 'userAlreadyExists'
  
  constructor(message: string) {
    super(message);
  }
}

class UserNotFound extends Error {
  name = 'userNotFound';

  constructor(message: string) {
    super(message);
  }
}

class ItemAlreadyAdded extends Error {
  name = 'itemAlreadyAdded';

  constructor(message: string) {
    super(message);
  }
}

class ItemNotFound extends Error {
  name = 'itemNotFound';

  constructor(message: string) {
    super(message);
  }
}

export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

const newError = {
  InvalidCredentials,
  InvalidTokenAuthorization,
  UserAlreadyExists,
  UserNotFound,
  ItemAlreadyAdded,
  ItemNotFound,
};

export default newError;