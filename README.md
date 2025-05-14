# TaskMaster

**Description:**

This project, TaskMaster, is a web application designed for managing tasks. The initial commit indicates it's a final project for a web development course and is intended for uploading final progress.

**Tools Used:**

Based on the `package.json` file, the project utilizes the following key tools and libraries:

* **Backend:**
    * Express: Web application framework for Node.js.
    * Mongoose: MongoDB object modeling tool.
    * bcrypt: For hashing passwords.
    * jsonwebtoken: For generating and verifying JSON Web Tokens for authentication.
    * cors: Middleware to enable Cross-Origin Resource Sharing.
    * cookie-parser: Middleware to parse Cookie headers.
    * multer: Middleware for handling `multipart/form-data`, primarily used for file uploads (like profile images).
    * stripe: For payment processing (likely for the 'pro' plan).
* **Frontend:**
    * HTML, CSS, JavaScript
    * Bootstrap 
    * SweetAlert2 
    * Chart.js 
    * FullCalendar 
* **Development/Testing:**
    * Jest: JavaScript testing framework.
    * @shelf/jest-mongodb: Jest preset for MongoDB testing.
    * ESLint: Pluggable JavaScript linter.
    * Babel: JavaScript compiler (used via @babel/preset-env and babel-jest).

**Requirements:**

* Node.js (version 18 or higher is recommended based on GitHub Actions workflow).
* npm (Node package manager, comes with Node.js).
* MongoDB instance (local or cloud-hosted).
* Stripe account (for payment processing features).

**How to Run/Start the App:**

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd taskManager
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    * You will need a MongoDB connection string. Create a `.env` file in the root directory and add `mongoConnection="your_mongodb_connection_string"`. (Inferred from `config/database.js`)
    * You will need a JWT secret key. Add `JWT_SECRET="your_jwt_secret_key"` to the `.env` file. (Inferred from `config/checkAuth.js`)
    * You will need Stripe secret and public keys. Add `STRIPE_SECRET_KEY="your_stripe_secret_key"` and `STRIPE_PUBLIC_KEY="your_stripe_public_key"` to the `.env` file. (Inferred from `routes/payment.js`)
4.  **Start the server:**
    ```bash
    npm start # Or node server.js
    ```
    The application should now be running at `http://localhost:3000` (Inferred from `server.js`).

**How to Contribute:**

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and ensure the code follows the project's coding standards (run ESLint).
4.  Write and run tests (`npm test`) to ensure your changes don't break existing functionality and new features are covered.
5.  Commit your changes and push to your fork.
6.  Create a pull request to the main branch of the original repository, describing your changes in detail.
