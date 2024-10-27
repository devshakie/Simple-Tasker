Here is a result from one of our tests. 
Two middleware functions are tested:
authMiddleware: Tests if the middleware calls next when a valid token is provided and returns a 401 status for an invalid token.
adminMiddleware: Tests access control, allowing admin users and denying access for non-admin users and here were the results

![image](https://github.com/user-attachments/assets/50c6b827-e56d-4fe1-b9ee-1039102e6cf1)
