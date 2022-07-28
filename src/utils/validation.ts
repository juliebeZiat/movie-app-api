const name = (name?: string): boolean => {
  if (!name) {
    return false
  }

  if (name.trim().length < 3) {
    return false
  }

  return true;
}

const password = (password?: string): boolean => {
  if (!password) {
    return false
  }

  if (password.trim().length <= 4) {
    return false
  }

  const mustContainOneNumer = /([0-9])/;

  if(!mustContainOneNumer.test(password)) {
    return false;
  }

  const mustContainOneUppercase = /([A-Z])/;

  if(!mustContainOneUppercase.test(password)) {
    return false;
  }

  return true;
}

const email = (email?: string): boolean => {
  if (!email) {
    return false
  }

  const regEx = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

  return regEx.test(email)
}

const validate = {
  email,
  name,
  password,
};

export default validate;