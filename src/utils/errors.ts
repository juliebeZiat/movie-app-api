export class InvalidCredentialsError extends Error {
  name = 'invalidCredentials'
  
  constructor(message: string) {
    super(message);
  }
}

export class UserAlreadyExistsError extends Error {
  name = 'userAlreadyExists'
  
  constructor(message: string) {
    super(message);
  }
}