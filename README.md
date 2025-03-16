1. Signup
Endpoint: POST 8081/signup

Content-Type: multipart/form-data

Request Parts:

data: JSON (FullUserDTO)

photo: Image file

Success Response:

Status: 200 OK

Body: String ("User signed-up successfully")

Error Responses:

400 Bad Request:

"Invalid credentials" (validation error)

"Email already in use"

Authentication: None

DTO Structure (FullUserDTO):

json
Copy
{
  "email": "string",
  "password": "string",
  "name": "string",
  "phoneNumber": "string"
}
2. Login
Endpoint: POST 8081/login

Content-Type: application/json

Request Body (AuthDTO):

json
Copy
{
  "email": "string",
  "password": "string"
}
Success Response:

Status: 200 OK

Body: JWT token String

Sets Cookie: jwToken=<token>

Error Responses:

400 Bad Request: "Nonexistent user" / "Invalid credentials"

403 Forbidden: "Banned user"

Authentication: None

User Endpoints
1. Get Current User Identity
Endpoint: GET 8083/users/id

Response:

json
Copy
{
  "id": "long",
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "picture": "string",
  "score": "int",
  "isAdmin": "boolean",
  "isBanned": "boolean"
}
Authentication: Valid JWT required

Permissions: Any authenticated user

2. Get User by ID
Endpoint: GET 8083/users/{id}

Response:

json
Copy
{
  "id": "long",
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "picture": "string",
  "score": "int"
}
Authentication: Valid JWT required

Permissions: Any authenticated user

3. Update User
Endpoint: PATCH 8083/users

Content-Type: application/json

Request Body:

json
Copy
{
  "id": "long",
  "name": "string",
  "email": "string",
  "phoneNumber": "string",
  "picture": "string"
}
Response: Updated User object (same structure as GET)

Authentication: Valid JWT required

Permissions: User can only update their own profile

4. Get All Users
Endpoint: GET 8083/users

Response:

json
Copy
[
  {
    "id": "long",
    "name": "string",
    "email": "string",
    "isAdmin": "boolean",
    "isBanned": "boolean",
    "score": "int"
  }
]
Authentication: Valid JWT required

Permissions: Admin users only

Error: 401 Unauthorized for non-admins

Post Endpoints
1. Get Filtered Posts
Endpoint: POST 8082/posts/filtered

Content-Type: application/json

Request Body (FiltersDTO):

json
Copy
Response:

json
Copy
[
    {
        post:{
            "id": "long",
            "title": "string",
            "text": "string",
            "picture": "string",
            "dateTime": "timestamp",
            "likes": "int",
            "dislikes": "int",
            "author": {
            "id": "long",
            "name": "string"
            }
        },
        action:..
    }

]
Authentication: Valid JWT required

Permissions: Any authenticated user