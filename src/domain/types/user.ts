export interface User {
  id: string;
  name: string;
  username: string;

  passwordHash: string;
  salt: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
}

export interface UserResponseShape {
  id: string;
  name: string;
  username: string;
}
