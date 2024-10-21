- Backend: NodeJS
- Frontend: AngularJS

## Front end(AngularJS): Pages:

- Register: A registration page for new users.
- Login: A login page for existing users (receives an access token and a refresh token, storing them in local storage)
- Authenticated: A protected page where API calls require an access token. The page automatically calls the refresh token API to obtain a new access token when the access token expires. On this page, the user can logout (call API to invalidate the created refresh token)

## Back end: The backend is built with Node.js using TypeScript and Prisma TypeORM to interact with PostgreSQL. It includes the following APIs:

- Register API: To register new users.
- Login API: For user login ( response an access token and a refresh token)
- Logout API: To invalidate the refresh token.
- Get Data API: This requires a Bearer access token.
- Refresh Token API: To create a new access token by validating the refresh token when the current one expires.
- The backend database includes a user table (id, email, full name, password) and a login session table (user ID, refresh token, logout status). This structure ensures that the refresh token belongs to the user and allows the system to invalidate the refresh token if the user logs out.
