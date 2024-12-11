# **Movie Review Web Application**

## **Project Description**

This project is a movie website where users can view movie details, submit reviews, and browse through user-generated reviews, make a group to discuss about the movie. The application allows users to rate movies, share their thoughts, and read others' feedback, make a list of favorite movie and user can also share profile and favorite list for other users. The movie details are fetched from a third-party API which is TMDB and Finkkino API, and the backend is integrated with a custom service.

This project has provided a valuable experience in full-stack development, working with React for the frontend, Node.js for the backend, and integrating with third-party APIs. It has allowed the team to focus on user interaction, API integration, and database management.

## **Technologies Used**

- **Frontend**: React, CSS Modules (for styling), Axios (for HTTP requests)
- **Backend**: Node.js, Express.js, PostgreSql (for database management)
- **API Integration**: TMDB API, Finkkino API
- **Authentication**: JWT (JSON Web Tokens) for handling user authentication
- **Deployment**: Microsoft Azure
- **Testing**: Mocha and Chai for backend testing

## **Project Team Members**

- **Tam Doan**: Full-stack Development - Login, Register, Authentication, overall project management
- **Shafiq**: Backend development - Search, Remove account
- **Sumaiya**: Backend development - Showtimes, Favorites
- **Nadeesha**: Backend development - Group feature
- **Shabnaz**: Full-stack Development - Review feature
- **Mohiudin**: Frontend Development - Design, Styling for all page

## **Architecture and Database Structure**

### **Architecture**

The application follows a client-server architecture. The frontend is built with React, and the backend is powered by Node.js and Express. The frontend communicates with the backend through RESTful API calls using Axios. The backend fetches and stores reviews from the PostgreSql database.

### **Databse Structure**

1. **Users**: Stores user's information like user_name, email, password, and others statement use for this project
2. **Reviews**: Stores user reviews, including the movie ID, review text, rating, and the user’s name.
3. **Groups**: Stores group's name and group's id
4. **Group_membership**: Stores member's name, group's name, group's id and is_admin statement of user
5. **Group's movies**: Stores movies or tv shows added by member
6. **Favorites**: Stores user's favorite movie id and user's id

## **How to install and use the application**

### **Prerequisites**

- Node.js (version 14 above)
- npm (version 6 above)
- PostgreSql (version 12 above)
- TMDB API key
- Git (for cloning the repository)

### **Installations Steps**

1. Clone the repository:

```bash
git clone https://github.com/Advance-Web-Project-Group-17/Server.git

git clone https://github.com/Advance-Web-Project-Group-17/Front-End.git
```

2. Install dependencies:
- For the backend

```bash
cd Server
npm install
```

- For the frontend

```bash
cd Front-End
npm install
```

3. Set up environment variables (create a `.env` file in both the frontend and backend directories):

- Backend (`.env`)

```makefile
PORT = 3001
DB_USER = postgres
DB_HOST = localhost
DB_NAME = movie web
DB_PASSWORD = your db password
DB_PORT = 5432
JWT_SECRET_KEY = your jwt secret key
TEST_DB_NAME = test_db
BASE_URL=movie-app-bqcscbfwdyfudrcy.germanywestcentral-01.azurewebsites.net
EMAIL_USER=your email
EMAIL_PASS=your password
API_KEY=your TMDB api key
```

- Frontend (`.env`)

```makefile
REACT_APP_API_KEY=your TMDB api key
REACT_APP_BASE_URL=http://localhost:3001
```

4. Start the backend server:

```bash
cd Server
npm run devStart
```

5. Start the frontend

```bash
cd Front-End
npm start
```

## **How to use the application**

- **View Movies**: The landing page displays all the trending movies, the movie page displays all the movies and both pages inclue all the details and reviews of the movie when clicked.
- **Search Movies**: The search bar at the top of the page allows you to search for movies.
- **Add Review**: You can add a review for a movie by clicking a movie card.
- **Create Group**: You can create a group by enter your group's name and click the create group button in group page, since you create the group so you are the admin of the group.
- **Join Group**: You can join a group by clicking the join group in any group to join.
- **Add Movie to Group**: You can add a movie to a group by clicking the add movie and select the group you want to add.
- **Remove movie from group**: You can also remove the movie you added from group by clicking the delete button in the movie card.
- **Delete Group**: You can delete a group by clicking the delete group button in group page (this action can only be done by admin of the group)
- **Remove user from group**: You can remove user from group by clicking the remove button in the user's name tag (this action can only be done by admin of the group)
- **Grant admin**: One group can have more than 1 admin so you can grant someone administation (this action can only be done by admin of the group)
- **Profile**: You can see your profile in the profile page after loggin in, the profile page inclues all your informations as well as your favorite list. You can also share your profile by clicking share profile button or undo share by clicking unshare profile button. You can edit your profile, log out as well as delete your account.
- **Share profile list**: In the Profile list page you can see all the shared profile from all users
- **Favorite**: You can add a movie to your favorite list by clicking the heart icon in movie or tv show card.
- **Show Times**: You can see all the schedule of all movies shown by Finkkino and you can change the location on the top left corner of the page. (the schedual is updated everyday)

## **Link to Working Application**

- [Movie App](https://mango-ground-00e600d03.4.azurestaticapps.net)

## **Link to other documentation**

- [Databse Diagram](https://dbdiagram.io/d/673770eee9daa85aca9a9d17)
- [Wire frame](https://www.figma.com/design/NFve6xHtYrAW2YuXggeOBh/Untitled-(Copy)?node-id=0-1&m=dev&t=XnRANchj7HR2NbwH-1)
## **GitHub Project Name**

The project is named "NetVerse" means digital universe of movie or serieses.

---

# **API Documentation**

## **Overview**

This API enables user authentication, email confirmation when register, and interactions with the TMDB API for fetching movie and TV show datas as well as Finkkino API for fetching show times. It supports secure operations features like bcrypt-based password handling and JWT authentication

---

## **User**

1. **Register User**
   **Endpoint**: `POST /user/register`
   Registers a new user and sends a confirmation email

**Request**

```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```

**Response**

- **201 Created**: User registered successfully. A confirmation email is sent.
- **400 Bad Request**: Invalid request data.

---

2. **Confirm Email**
   **Endpoint**: `GET /user/confirm/:token`
   Confirms a user's email using a token sent in the registration email.

**Response**

- **200 OK**: Email confirmed successfully.
- **400 Bad Request**: Invalid or expired token.

---

3. **Login User**
   **Endpoint**: `POST /user/login`  
   Logs in a user and returns a JWT token.

**Request**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**

- **200 OK**: Successful login and JWT token returned.
- **401 Unauthorized**: Invalid credentials.

---

4. **Delete user's account**
   **Endpoint**: `DELETE /user/delete`
   Deletes a user's account.

**Request**

```json
{
  "password": "string"
}
```

**Response**

- **200 OK**: User account deleted successfully.
- **401 Bad Request**: Wrong password or admin of somegroup.

---

5. **Get user's profile**
   Return user's information

**Endpoint**: `GET /user/profile/:user_id`

**Response**

- **200 OK**: User's information returned.
- **404 Not Found**: User not found.

---

6. **Edit profile**
   Allow logged in user to edit profile

**Endpoint**: `PUT /user/profile/edit/:user_id`

**Request**

```json
{
  "nick_name": "string",
  "location": "string"
}
```

**Response**

- **200 OK**: Profile updated successfully.
- **400 Unauthorized**: Not logged in.

---

7. **Get user's group**
   Return all group that user attended in

**Endpoint**: `GET /user/group/:user_id`

**Response**

- **200 OK**: Group information returned.
- **404 Not Found**: User not found.

---

8. **Share profile**
   Allow user to share profile with other user or unshare profile

**Endpoint**: `PUT /user/profile/share`

**Request**

```json
{
  "user_id": "integer"
}
```

**Response**

- **200 OK**: Profile shared successfully.
- **404 Unauthorized**: User not found.

---

9. **Get all shared profile**
   Return all shared profile of user

**Endpoint**: `GET /user/shared`

**Response**

- **200 OK**: Shared profile information returned.
- **404 Not Found**: No shared profile found.

---

## **Group**

1. **Create group**
   Create group and the group's creater is an admin of group

**Endpoint**: `POST /group/create`

**Request**

```json
{
  "group_name": "string",
  "user_id": "integer"
}
```

**Response**

- **200 OK**: Group created successfully.
- **404 Unauthorized**: User not found.

---

2. **Get all group**
   Return all group of user

**Endpoint**: `GET /group/getGroup`

**Response**

- **200 OK**: Group name returned.
- **404 Not Found**: No group found.

3. **Get specific group**
   Return specific group of user based on group_id

**Endpoint**: `GET /group/getGroup/:group_id

**Response**

- **200 OK**: Group name returned.
- **404 Not Found**: No group found.

4. **Remove group**
   Remove group and all things related to that group

**Endpoint**: `DELETE /group/removeGroup/:group_id

**Response**

- **200 OK**: Group removed successfully.
- **403 Not Found**: User is not admin of the group.
- **404 Not Found**: No group found.

5. **Add member to group**
   Add member to group

**Endpoint**: `POST /group/addmember`

**Request**

```json
{
  "group_id": "string",
  "user_id": "string"
}
```

**Response**
- **200 OK**: Member added successfully.
- **400 Not Found**: Missing or invalid input

6. **Remove member from group**
Removes a member from a group. Requires admin rights.

**Endpoint**: `DELETE /group/removeMember`

**Request**
```json
{
  "group_id": "string",
  "user_id": "string",
  "removed_id": "string"
}
```
**Response**
- **200 OK**: Member removed successfully.
- **403 Not Found**: User is not admin of the group.
- **404 Not Found**: Removed user not found in group.

7. **Get group's member**
Fetches the list of members in a group.

**Endpoint**: `GET /group/getMember/:group_id`

**Response**
- **200 OK**: List of members in the group.
- **404 Not Found**: No group found.

7. **Grant admin right**
Grant admin right to a user in a group.

**Endpoint**: `PUT /grantAdmin/:group_id`

**Request**
```json
{
  "grantedMemberId": "string",
  "user_id": "string"
}
```
**Response**
- **200 OK**: Admin right granted successfully.
- **403 Forbidden**: User is not admin of the group.
- **400 Bad Request**: Missing field.

8. **Add Movie to Group**
Add a movie to a group.

**Endpoint**: `POST /group/addMovie`

**Request**
```json
{
  "group_id": "string",
  "movie_id": "string",
  "user_id": "string"
}
```
**Response**    
- **200 OK**: Movie added successfully.
- **403 Forbidden**: User is not a member of the group.

9. **Add TV Show to Group**
Add a TV show to a group.

**Endpoint**: `POST /group/addTvShow`

**Request**
```json
{
  "group_id": "string",
  "tv_id": "string",
  "user_id": "string"
}
```
**Response**    
- **200 OK**: Tv show added successfully.
- **403 Forbidden**: User is not a member of the group.

10. **Get Group Movies**
Get all movies in a group.

**Endpoint**: `GET /group/getMovie/:group_id`

**Response**
- **200 OK**: List of movies.
- **500 Internal Server Error**: If any error occurs.

11. **Get Group TV Shows**
Get all TV shows in a group.

**Endpoint**: `GET /group/getTvShow/:group_id`

**Response**
- **200 OK**: List of tv shows.
- **500 Internal Server Error**: If any error occurs.

12. **Delete Movie from Group**
Removes a movie from a group if added by the user.

**Endpoint**: `DELETE /group/deleteMovie/:group_id`

**Request**
```json
{
  "movie_id": "string",
  "user_id": "string"
}
```

**Response**
- **200 OK**: Movie deleted successfully.
- **403 Forbidden**: User is not a person who added movie to group.

13. **Delete TV Show from Group**
Removes a TV show from a group if added by the user.

**Endpoint**: `DELETE /group/deleteTvShow/:group_id`

**Request**
```json
{
  "tv_id": "string",
  "user_id": "string"
}
```

**Response**
- **200 OK**: Tv show deleted successfully.
- **403 Forbidden**: User is not a person who added tv show to group.

14. **Get User's Groups**
Retrieves all groups that the user is a member of.

**Endpoint**: `GET /group/getUserGroup/:user_id`

**Response**
- **200 OK**: List of groups.   
- **500 Internal Server Error**: If any error occurs.   

14. **Check Member in Group**
Checks if a user is a member of a group.

**Endpoint**: `POST /group/checkMember/:group_id`

**Request**
```json
{
  "user_id": "string"
}
```
**Response**
- **200 OK**: User is a member of the group.    
- **404 Not Found**: User is not a member of the group.

15. **Leave Group**
Leave group

**Endpoint**: `DELETE /group/outGroup/:group_id`

**Request**
```json
{
  "user_id": "string"
}
```

**Response**
- **200 OK**: Left the group successfully.
- **500 Internal Server Error**: If any error occurs. 

16. **Check if User is Admin**
Checks if a user is an admin of a group.

**Endpoint**: `POST /group/checkAdmin`

**Request**
```json
{
  "group_id": "string",
  "user_id": "string"
}
```

**Response**
- **200 OK**: User is an admin of the group.
- **404 Not Found**: User is not an admin of the group. 

---

## **Review**

1. **Adds a new review for a movie**

**Endpoint**: `POST /reviews`

**Request**
```json
{
  "movie_id": "string",
  "review_text": "string",
  "rating": "number"
}
```

**Response**
- **201 OK**: Review added successfully.
- **400 Bad Request**: Missing require field

2. **Retrieves all reviews for a specific movie**
Retrieves all reviews for a specific movie.

**Endpoint**: `GET /movies/:movieId/reviews`

**Response**
- **200 OK**: List of reviews for the movie.

---

## **Favorite**

1. **Add a Favorite**
Adds a movie or TV show to the user's favorites list.

**Endpoint**: `POST /favorites/add`

**Request**
```json
{
  "user_id": "string",
  "movie_id": "string",
  "type": "string" // Possible values: "movie" or "tv"
}
```

**Response**
- **201 Created**: Favorite added successfully.
- **400 Bad Request**: Missing required fields or item already in favorites.

2. **Retrieve All Favorites for a User**
Fetches the user's favorite movies and TV shows, including details from TMDB.

**Endpoint**: `GET /favorites/:user_id`

**Response**
- **200 OK**: List of user's favorite movies and TV shows.
- **400 Bad Request**: Missing user ID.
- **404 Not Found**: User not found.

3. **Retrieve Shared Favorites by Username**
Fetches a public list of favorites shared by a user.

**Endpoint**: `GET /favorites/shared/:username`

**Response**
- **200 OK**: List of shared favorites.
- **400 Bad Request**: Missing username.
- **404 Not Found**: No shared favorites found for the user.

4. **Toggle Sharing for a User's Favorites**
Enables or disables sharing of the user's favorite list.

**Endpoint**: `PUT /favorites/:user_id/toggle-sharing`

**Request**
```json
{
  "is_shared": "boolean" // true to enable sharing, false to disable
}
```
**Response**
- **200 OK**: Sharing status updated successfully.
- **400 Bad Request**: Missing user ID or invalid `is_shared` value.

5. **Remove a Favorite**
Deletes a movie or TV show from the user's favorites list.

**Endpoint**: `DELETE /favorites/:user_id/:movie_id`

**Response**
- **204 No Content**: Favorite removed successfully.    
- **400 Bad Request**: Missing user ID or movie ID.
- **404 Not Found**: Favorite not found.

---

## **Search**

1. **Search for Movies**
Searches for movies based on various criteria like title, genre, release year, and rating.

**Endpoint**: `GET /search/movie`

**Request**
```json
{
    "title": "string",
    "genre": "string",
    "release_year": "integer",
    "rating": "number"
}
```

**Response**
- **200 OK**: List of matching movies.
- **400 Bad Request**: Missing query parameters.    
- **404 Not Found**: No matching movies found.

2. **Search for TV Shows**
Searches for tv shows based on various criteria like title, genre, release year, and rating.

**Endpoint**: `GET /search/tv`

**Request**
```json
{
    "title": "string",
    "genre": "string",
    "release_year": "integer",
    "rating": "number"
}
```

**Response**
- **200 OK**: List of matching tv shows.
- **400 Bad Request**: Missing query parameters.    
- **404 Not Found**: No matching tv shows found.