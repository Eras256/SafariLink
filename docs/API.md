# SafariLink Platform API Documentation

## Base URL

```
https://api.safarilink.xyz
```

## Authentication

Most endpoints require JWT authentication via Bearer token:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /api/auth/nonce
Get nonce for wallet signature authentication.

**Request:**
```json
{
  "address": "0x..."
}
```

**Response:**
```json
{
  "nonce": "random_string"
}
```

#### POST /api/auth/verify
Verify signed message and receive JWT token.

**Request:**
```json
{
  "address": "0x...",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "accessToken": "jwt_token",
  "user": { ... }
}
```

### Hackathons

#### GET /api/hackathons
List all hackathons with filters.

**Query Parameters:**
- `status`: Filter by status
- `chain`: Filter by blockchain
- `page`: Page number
- `limit`: Results per page

#### GET /api/hackathons/:id
Get hackathon details.

#### POST /api/hackathons
Create new hackathon (requires auth).

#### POST /api/hackathons/:id/register
Register for hackathon (requires auth).

### Projects

#### GET /api/projects
List all projects.

#### GET /api/projects/:id
Get project details.

#### POST /api/projects
Create new project (requires auth).

#### POST /api/projects/:id/submit
Submit project for judging (requires auth).

### Grants

#### GET /api/grants
List user's grant applications (requires auth).

#### POST /api/grants
Create grant application (requires auth).

## Rate Limits

- API: 100 requests per 15 minutes
- Auth: 5 requests per 15 minutes
- Submissions: 10 per hour

## Error Responses

```json
{
  "error": "Error message",
  "details": { ... }
}
```

