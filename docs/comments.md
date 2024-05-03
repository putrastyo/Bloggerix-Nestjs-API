# API Docs

## COMMENT

### create

endpoint: [POST /api/articles/:articleId/comments]

Request Headers:

- Authorization: Bearer (token)

request body:

```json
{
  "text": "test"
}
```

response success (201):

```json
{
  "data": {
    "id": 1,
    "text": "test",
    "user_id": 1,
    "article_id": 1,
    "user": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    },
    "article": {
      "id": 1,
      "title": "test",
      "content": "iya",
      "category": "test",
      "tags": "test",
      "author_id": 1
    }
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": [
    "text should not be empty",
    ...
  ],
}
```

### Get All Comment

endpoint: [GET /api/articles/:articleId/comments]

response success (200):

```json
{
  "data": [
    {
      "id": 1,
      "text": "test",
      "user_id": 1,
      "article_id": 1,
      "user": {
        "id": 1,
        "name": "test",
        "email": "iya",
        "avatar_url": "..."
      },
      "article": {
        "id": 1,
        "title": "test",
        "content": "iya",
        "category": "test",
        "tags": "test",
        "author_id": 1
      }
    },
    ...
  ]
}
```

### update

endpoint: [PUT /api/articles/:articleId/comments/:commentId]

Request Headers:

- Authorization: Bearer (token)

request body:

```json
{
  "text": "test"
}
```

response success (200):

```json
{
  "data": {
    "id": 1,
    "text": "test",
    "user_id": 1,
    "article_id": 1,
    "user": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    },
    "article": {
      "id": 1,
      "title": "test",
      "content": "iya",
      "category": "test",
      "tags": "test",
      "author_id": 1
    }
  }
}
```

response failed (400):

```json
{
  "message": "Invalid Field",
  "errors": ["text should not be empty"]
}
```

response failed (404):

```json
{
  "message": "Comment Not Found"
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```

### Delete

endpoint: [DELETE /api/articles/:articleId/comments/:commentId]

Request Headers:

- Authorization: Bearer (token)

response success (200):

```json
{
  "data": {
    "id": 1,
    "text": "test",
    "user_id": 1,
    "article_id": 1,
    "user": {
      "id": 1,
      "name": "test",
      "email": "iya",
      "avatar_url": "..."
    },
    "article": {
      "id": 1,
      "title": "test",
      "content": "iya",
      "category": "test",
      "tags": "test",
      "author_id": 1
    }
  }
}
```

response failed (404):

```json
{
  "message": "Comment Not Found"
}
```

Response Failed (401):

```json
{
  "message": "Unauthorized"
}
```
