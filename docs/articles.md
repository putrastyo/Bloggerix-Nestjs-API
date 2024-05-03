# API Docs

## ARTICLE

### create

endpoint: [POST /api/articles]

request body:

```json
{
  "title": "test title",
  "content": "test content",
  "category": "test",
  "tags": "tag1, tag2, tag3",
  "thumbnail": "okiahgiaeg.jpg",
  "author_id": 1
}
```

response success (201):

```json
{
  "data": {
    "id": 1,
    "title": "test title",
    "content": "test content",
    "category": "test",
    "tags": "tag1, tag2, tag3",
    "author_id": 1,
    "author": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    }
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "title should not be empty",
    "content should not be empty",
    ...
  ],
}
```

### Get All Article

endpoint: [GET /api/articles]

response success (200):

```json
{
  "data": [
    {
      "id": 1,
      "title": "test title",
      "content": "test content",
      "category": "test",
      "tags": "tag1, tag2, tag3",
      "author_id": 1,
      "author": {
        "id": 1,
        "name": "test",
        "email": "iya",
        "avatar_url": "..."
      }
    },
    ...
  ],
  "pagination": {
    "current_page": 2,
    "total_page": 10,
    "size": 15,
  }
}
```

### Get Detail

endpoint: [GET /api/articles/:articleId]

response success (200):

```json
{
  "data": {
    "id": 1,
    "title": "test title",
    "content": "test content",
    "category": "test",
    "tags": "tag1, tag2, tag3",
    "author_id": 1,
    "author": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    }
  }
}
```

response failed (404):

```json
{
  "message": "Article Not Found"
}
```

### Get by authenticated user

endpoint: [GET /api/articles/user]

Request Headers:

- Authorization: Bearer (token)

Response Success (200):

```json
{
  "data": [
    {
      "id": 1,
      "title": "test title",
      "content": "test content",
      "category": "test",
      "tags": "tag1, tag2, tag3",
      "author_id": 1,
      "author": {
        "id": 1,
        "name": "test",
        "email": "iya",
        "avatar_url": "..."
      }
    },
    ...
  ],
  "pagination": {
    "current_page": 1,
    "total_page": 3,
    "size": 10,
  }
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```

### update

endpoint: [PUT /api/articles/:articleId]

Request Headers:

- Authorization: Bearer (token)

request body:

```json
{
  "title": "test title",
  "content": "test content",
  "category": "test",
  "tags": "tag1, tag2, tag3",
  "thumbnail": "okiahgiaeg.jpg"
}
```

response success (200):

```json
{
  "data": {
    "id": 1,
    "title": "test title",
    "content": "test content",
    "category": "test",
    "tags": "tag1, tag2, tag3",
    "author_id": 1,
    "author": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    }
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "title should not be empty",
    "content should not be empty",
    ...
  ],
}
```

response failed (404):

```json
{
  "message": "Article Not Found"
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```

### Delete

endpoint: [DELETE /api/articles/:articleId]

Request Headers:

- Authorization: Bearer (token)

response success (200):

```json
{
  "data": {
    "id": 1,
    "title": "test title",
    "content": "test content",
    "category": "test",
    "tags": "tag1, tag2, tag3",
    "author_id": 1,
    "author": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    }
  }
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```
