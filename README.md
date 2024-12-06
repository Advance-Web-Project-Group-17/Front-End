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

## **GitHub Project Name

The project is named "Movie Web Application" in the GitHub repository, reflecting the core functionality of the app. 

