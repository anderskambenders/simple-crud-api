# CRUD API
## Prepare for use
1. Clone repository.
2. Checkout to `develop` branch
3. Run `npm install` to download node_modules
4. PORT number is stored in `.env` file of root folder of project (You should rename `.env.example` file)
5. Run server

## Run server 
- in develop mode: `npm run start:dev`
- in production mode (build and run bundle): `npm run start:prod`
- in multi mode: `npm run start:multi`

## Test:

**NOTICE: server shouldn't be run during tests!**

command to run tests: `npm run test`

## Request methods:
- `GET '/api/users'`:
    - `200` response with an array of users
- `GET '/api/users/:id'`:
    - `200` - response with user with `id`
    - `400` - `id` - is not valid `uuid`
    - `404` - user with entered `id` is not found
- `POST '/api/users'`:
    - `201` - response with created user
    - `400` - body request is not valid
    
    example of valid request body:
```json
{
    "username": "John",
    "age": 27,
    "hobbies": ["nodejs"]
}
``` 

   types of fields:
   
    "username": string
    "age": number
    "hobbies": Array<string> or Empty array    
- `PUT '/api/users/:id'`
    - `200` - response with updated user object
    - `400` - invalid `id` or request body (valid body is same as in `POST`)
    - `404` - user with entered `id` is not found
- `DELETE '/api/users/:id'`
    - `204` - user is successfully deleted 
    - `400` - `id` is not valid `uuid` 
    - `404` - user with `id` is not found