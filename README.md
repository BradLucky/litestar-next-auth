## Litestar/NextJS auth test

This is a simple app to work out issues with authentication between Litestar and NextJS.

Pre-requisites:
1. Clone this repo
1. [Install `uv`](https://docs.astral.sh/uv/getting-started/installation/)

### Start backend server

```shell
uv sync
source .venv/bin/activate
litestar run
```

### Start frontend server

```shell
cd client/
npm i
npm run dev
```

Note: If NextJS starts with a port other than 3000, you'll have to update `app.py` in the root directory where it has `localhost:3000` to reflect the correct port. After updating, restart the backend server.

## Logout Test (Resolved in 773ff2d70ab2e7b3fcdceaa31fad84de28666af6)

### Backend Logout
Observe that the backend server properly destroys the cookie when logging out and thus prevents you from seeing protected data.
1. Start with the same login scenario: [instructions](#backend-login)
1. Click on [http://localhost:8000/schema/rapidoc#post-/logout]("Logout") and click "Try."
1. Observe that the cookie has been deleted.
1. Return to [http://localhost:8000/schema/rapidoc#get-/user]("GetUser") and see that you get a 401 error.

### Frontend Logout
Observe that the frontend does not remove the cookie and protected data is still viewable.
_Note: clear cookies to ensure this is a clean test_

1. Start with the same login scenario: [instructions](#frontend-login)
1. Go to the logout page: [http://localhost:3000/logout](http://localhost:3000/logout)
1. Click the "Logout" button.
1. Observe that the cookie has _not_ been deleted.
1. Return to [http://localhost:8000/schema/rapidoc#get-/user]("GetUser") and see that you still see the protected data.

## Login Test (Resolved in 773ff2d70ab2e7b3fcdceaa31fad84de28666af6)

### Backend Login
Observe that the backend server allows you to access protected endpoints as much as you want.
1. First, try to access user data: go to [http://localhost:8000/user](http://localhost:8000/user) and see a 401 response, because you have not signed in.
1. Go to the API schema documentation. Use [http://localhost:8000/schema/rapidoc](rapidoc) so that you can test with a different request body.
1. Click on [http://localhost:8000/schema/rapidoc#post-/login]("Login") and enter the hardcoded user email so that your request body looks like this:
    ```javascript
    {
      "email": "a@a.com",
      "password": "string"
    }
    ```
1. Click "Try" and see that you get a 201 response. Also, if you have your browser dev tools open, you can see that a cookie was created. With each click of "Try" a new cookie will be created.
1. Now, go to [http://localhost:8000/schema/rapidoc#get-/user]("GetUser") and see that you get a valid 200 response with data.
1. Also, in a new browser tab, you can go to [http://localhost:8000/user](http://localhost:8000/user) and see the same data endless times.

### Frontend Login
Observe that the frontend behaves differently.
_Note: clear cookies to ensure this is a clean test_

1. Go to the root URL with login: [http://localhost:3000/](http://localhost:3000/)
1. Enter the same username as above: `a@a.com`. The password doesn't actually matter, but you need a value.
1. Click "Login" and see that you get a 201 response, as well as a cookie created.
1. Go to the user page ([http://localhost:3000/user](http://localhost:3000/user)) and see that you get "Test: No data received".
1. In your log output, you'll see that you got a 401 response. (You may also see a couple 200 responses.)
1. If, in a new browser tab, you go to [http://localhost:8000/user](http://localhost:8000/user), you'll see you can get the data still.
