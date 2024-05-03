# API Docs

## AUTH

### register

endpoint: [POST /api/auth/register]

request body:

```json
{
  "name": "test",
  "email": "test@example.com",
  "password": "test123",
  "confirm_password": "test123",
  "avatar": "http://localhost:3000/uploads/avatars/exeiyweb71307ah.jpg" // nullable
}
```

response success (201):

```json
{
  "data": {
    "access_token": "ec2a33ig.8eaogq.ou3g", // JWT AT
    "refresh_token": "wegig13.aiu82.oagf9" // JWT RT
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "name should not be empty",
    "email already exisst",
    ...
  ],
}
```

### login

endpoint: [POST /api/auth/login]

request body:

```json
{
  "email": "test@example.com",
  "password": "test123"
}
```

response success (200):

```json
{
  "data": {
    "access_token": "ec2a33ig.8eaogq.ou3g", // JWT AT
    "refresh_token": "wegig13.aiu82.oagf9" // JWT RT
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "email should not be empty",
    "password should not be empty",
    ...
  ]
}
```

response failed (401):

```json
{
  "message": "Can't find account"
}
```

### logout

endpoint: [DELETE /api/auth/logout]

Request Headers:

- Authorization: Bearer (token)

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```

### current

endpoint: [GET /api/auth/current]

Request Headers:

- Authorization: Bearer (token)

Response Success (200):

```json
{
  "data": {
    "id": 1,
    "name": "test",
    "email": "test@example.com",
    "role": "admin",
    "avatar_url": "http://localhost:3000/uploads/avatars/exeiyweb71307ah.jpg" // nullable
  }
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```

### update user

endpoint: [PATCH /api/auth]

Request Headers:

- Authorization: Bearer (token)

request body:

```json
{
  "name": "test", // optional
  "email": "test@example.com", // optional
  "avatar": "http://localhost:3000/uploads/avatars/exeiyweb71307ah.jpg" // optional
}
```

response success (200):

```json
{
  "data": {
    "name": "test",
    "email": "test@example.com",
    "role": "admin",
    "avatar": "http://localhost:3000/uploads/avatars/exeiyweb71307ah.jpg" // nullable
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "name should not be empty",
    "email already exisst",
    ...
  ],
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```

### Change Password

endpoint: [PUT /api/auth/change-password]

Request Headers:

- Authorization: Bearer (token)

request body:

```json
{
  "old_password": "test123",
  "new_password": "test321",
  "confirm_new_password": "test321"
}
```

response success (200):

```json
{
  "data": {
    "name": "test",
    "email": "test@example.com",
    "role": "admin",
    "avatar": "http://localhost:3000/uploads/avatars/exeiyweb71307ah.jpg" // nullable
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "old_password should not be empty",
    "old_password is wrong",
    "confirm_new_password and new_password is doesn't match",
    ...
  ],
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```
