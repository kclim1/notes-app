# notes-app - Nimbus

## Index
- Overview
- Features
- Getting Started
- Running the Application
- Usage
- Project Structure
- Dependencies
- Known Issues
## Overview
Nimbus is a note-taking app built using Node.js,Express,Mongoose and Atlas. It features Local,Google and Github authentication, basic CRUD operations and is styled with bootstrap. Oh you can also share your notes with your friend and collaborate in realtime. 

## Features
- **User Authentication**: Sign up via local passport or sign in via google and github. 

- **User-friendly Interface**: Simple and straightforward UI with option to turn on dark mode. 
- **Confirmation Modals**: Custom modals for confirmation from sweetalerts library. 

## Getting Started
Follow these steps to set up and run the application:

1. **Clone the repository:**
   ```bash
    git clone git@github.com:kclim1/notes-app.git
    ```
2. **Navigate to root:**
    ```bash
    cd notes-app
    ```
3. **Install dependencies:**
    ```bash
    npm i 
    ```
4. **Set up .env keys if needed**
    ```bash
    GOOGLE_CLIENT_ID = your_ID
    GOOGLE_SECRET = your_secret
    GOOGLE_URI = your_ID
    SECRET  = your_secret 
    GITHUB_CLIENT_ID = your_github_id
    GITHUB_SECRET = your_github_secret
    MONGODB_URI = = your_mongodb_uri
    ```
5. **Run App:**
    ```bash
    npm start 
    ```
6. http://localhost:3000 will direct you to the index page. 

## Usage
To try out the realtime collaboration and the CRUD features of this app, I suggest you create at least 2 accounts. Then login to those accounts via 2 separate browsers. **I highly suggest using incognito.** Create a note from either account. The note cannot be shared until after it has been created. Then click "View Note" and you'll see a share button on the bottom right of the text area. Now simply add in a valid email. Once it's shared, you may need to refresh your dashboard for the note to appear. Once it does, feel free to place them side by side and start typing away to experience realtime collaboration. Once you're done with that you can delete the note and it'll be removed from both users' dashboard. 

## Project Structure
```bash
notes-app
├── public
│   ├── css
│   │   ├── dashboard.css
│   │   ├── notepad.css
│   │   └── styles.css
│   └── img
│       ├── note.svg
│       ├── shrug.svg
│       └── wrong.svg
├── server
│   ├── config
│   │   ├── db.js
│   │   ├── notes.js
│   │   └── user.js
│   ├── controllers
│   │   ├── dashboardControllers.js
│   │   └── mainController.js
│   └── routes
│       ├── auth.js
│       └── index.js
├── views
│   ├── layouts
│   │   ├── dashboard.ejs
│   │   └── main.ejs
│   ├── partials
│   │   ├── footer_dashboard.ejs
│   │   ├── footer.ejs
│   │   ├── header_dashboard.ejs
│   │   └── header.ejs
│   ├── dashboard.ejs
│   ├── editNote.ejs
│   ├── index.ejs
│   ├── login.ejs
│   ├── page404.ejs
│   ├── pricing.ejs
│   ├── reviews.ejs
│   └── signup.ejs
├── .gitignore
├── app.js
├── README.md
├── package.json
└── package-lock.json
```

### Dependencies

- **bcryptjs**  
  **Description:** A library to help you hash passwords.  
  **Installation:**  
  ```bash
  npm install bcryptjs
  ```
- **connect-mongo**  
  **Description:** A MongoDB session store for Express that allows sessions to be stored in a MongoDB database.  
  **Installation:**  
  ```bash
  npm install connect-mongo
- **crypto**  
  **Description:** A built-in Node.js module for cryptographic functionality, including creating hashes and generating random values.  
  **Installation:** Comes pre-installed with Node.js, no separate installation needed.

- **dotenv**  
  **Description:** Loads environment variables from a `.env` file into `process.env`. This is used to manage sensitive information such as database URIs and session secrets.  
  **Installation:**  
  ```bash
  npm install dotenv
    ```
- **ejs**  
  **Description:** Embedded JavaScript templates that let you generate HTML markup with plain JavaScript.  
  **Installation:**  
  ```bash
  npm install ejs
    ```
- **express**  
  **Description:** A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.  
  **Installation:**  
  ```bash
  npm install express
    ```
- **express-ejs-layouts**  
  **Description:** Layout support for Express.js applications that use the EJS template engine.  
  **Installation:**  
  ```bash
  npm install express-ejs-layouts
    ```
- **express-session**  
  **Description:** A session middleware for Express that helps in managing user sessions with support for various session stores.  
  **Installation:**  
  ```bash
  npm install express-session
    ```
- **express-validator**  
  **Description:** A set of express.js middlewares that wraps validator.js for data validation and sanitization.  
  **Installation:**  
  ```bash
  npm install express-validator
    ```
- **method-override**  
  **Description:** Middleware that allows you to use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.  
  **Installation:**  
  ```bash
  npm install method-override
    ```
- **mongoose**  
  **Description:** An ODM (Object Data Modeling) library for MongoDB and Node.js. It provides a straightforward API for interacting with MongoDB, including schema validation and model management.  
  **Installation:**  
  ```bash
  npm install mongoose
    ```
- **passport**  
  **Description:** A middleware for Node.js that simplifies user authentication by providing various strategies for different authentication methods.  
  **Installation:**  
  ```bash
  npm install passport
    ```
- **passport-github2**  
  **Description:** A Passport strategy for authenticating with GitHub using OAuth 2.0.  
  **Installation:**  
  ```bash
  npm install passport-github2
    ```
- **passport-google-oauth20**  
  **Description:** A Passport strategy for authenticating with Google using OAuth 2.0.  
  **Installation:**  
  ```bash
  npm install passport-google-oauth20
    ```
- **passport-local**  
  **Description:** A Passport strategy for authenticating with a username and password.  
  **Installation:**  
  ```bash
  npm install passport-local
    ```
- **socket.io**  
  **Description:** A JavaScript library for real-time, bidirectional communication between web clients and servers.  
  **Installation:**  
  ```bash
  npm install socket.io
    ```
- **socket.io-client**  
  **Description:** The client-side library for connecting to a Socket.IO server for real-time communication.  
  **Installation:**  
  ```bash
  npm install socket.io-client
    ```
- **nodemon**  
  **Description:** A development tool that automatically restarts the Node.js server when file changes in the directory are detected.  
  **Installation:**  
  ```bash
  npm install nodemon --save-dev
    ```

## Known Issues

- Real-time collaboration may experience slight lag in low-bandwidth conditions. 
- Errors may occur if logged into two accounts using same browser. Sometimes even a separate browser. It's best to use one in incognito and the other regular. 
- Dark mode toggle may not persist on page reload.

## List of Key Technologies Used

- **Node.js**: JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express.js**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database for storing user data and notes.
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
- **Passport.js**: Middleware for user authentication supporting various strategies, including local, Google, and GitHub.
- **Socket.io**: A JavaScript library for real-time, bidirectional communication between web clients and servers.
- **Bootstrap**: A popular CSS framework for responsive design and styling.
- **SweetAlert**: A library for creating beautiful, customizable, and responsive modals.



