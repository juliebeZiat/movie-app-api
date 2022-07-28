class InvalidCredentials extends Error {
  name = 'invalidCredentials'
  
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

const newError = {
  InvalidCredentials,
  UserAlreadyExists,
  UserNotFound,
  ItemAlreadyAdded,
};

export default newError;