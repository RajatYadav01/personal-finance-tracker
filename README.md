# Personal Finance Tracker

## Table of contents

- [Personal Finance Tracker](#personal-finance-tracker)
  - [Table of contents](#table-of-contents)
  - [About](#about)
    - [Overview](#overview)
    - [Key features](#key-features)
  - [Usage](#usage)
  - [Working](#working)
  - [Development](#development)
    - [Requirements](#requirements)
    - [Setup](#setup)

## About

### Overview

A comprehensive web application that helps users track income, expenses, budgets and generate insightful financial reports.

### Key features

- Secure authentication: JSON Web Token (JWT) is issued by the server during the login process and automatically sent with each subsequent request.
- Data validation: Form handling is done with proper validation both at the client and server side.
- Transaction tracking: Record income and expenses with categories.
- Recurring transactions: Automate regular payments and income.
- Receipt management: Upload and store transaction receipts.
- Budget management: Create and manage budgets with spending limits.
- Currency conversion: Support for multiple currencies with real-time exchange rates.
- Visual analytics: Interactive charts and reports using Chart.js.
- Report import/export: CSV import/export functionality.

## Usage

To use the project you can visit [RajatYadav01.github.io/personal-finance-tracker](https://rajatyadav01.github.io/personal-finance-tracker/) which hosts the projects's front end. The back end of project is hosted on [Render](https://render.com) and the database is hosted on [Neon](https://neon.com/).

## Working

**User registration**:

- New users can register by clicking on the **Get Started** button and providing the details name, email address, default currency and password.
- Comprehensive form validation is done including password strength checks.

**Login**:

- Users can login using the registered email address and password.
- JWT-based authentication system is used in which access token is refreshed after it expires by using the stored refresh token.
- If the user forgets the password to the account then it can be reset by clicking on the **Forgot password** link.

**Dashboard**:

- Financial overview:
  - Current balance display
  - Monthly income and expense totals
  - Net worth tracking

- Quick insights:
  - Spending by category in the form of pie charts
  - Monthly trends in the form of line charts
  - Budget utilization progress bars

- Recent activity:
  - Last 5-10 transactions
  - Upcoming recurring transactions

**Transaction**:

- View:
  - A list of all transactions

- Create:
  - Add income or expense transactions
  - Categorize transactions with customizable categories
  - Set recurring transactions (daily, weekly, monthly, yearly)
  - Attach receipts (images/PDFs)
  - Multi-currency support with auto-conversion

- Update:
  - Edit any transaction's details

- Delete:
  - Remove a single transaction
  - Confirmation dialog to prevent accidental deletion

**Budget**:

- View:
  - A list of all budgets

- Create:
  - Add a budget with name, description and monthly limit

- Update:
  - Modify budget attributes

- Delete:
  - Remove unused budgets

**Reports**:

- Spending reports:
  - Category-wise spending breakdown
  - Time period comparisons
  - Custom date range selection

- Income reports:
  - Income source analysis
  - Monthly/quarterly/yearly trends
  
- Net Worth Tracking:
  - Asset vs liability tracking
  - Historical net worth charts

- Export options:
  - CSV export for all reports

**Settings**:

- User can update the profile details including name, email address, default currency and password.
- User can also delete the account by clicking on the **Delete** button after which all of the data associated to the user will be delete permanently from the database.

## Development

### Requirements

You need to have the following installed on your system:

- Node.js (preferably, version >= v22.17.x)
- npm (preferably, version >= v10.9.x)
- Rails (preferably, version >= v8.0.x)
- Ruby (preferably, version >= v3.2.x)
- PostgreSQL (preferably, version >= v16.x)
- Redis (preferably the latest version)
- Git (preferably the latest version)
- Docker (preferably the latest version)

### Setup

To modify and use this project locally on your system, follow these steps:

1. Clone the project's repository.

   ```shell
   git clone https://github.com/rajatyadav01/personal-finance-tracker.git
   ```

2. Go to the project folder using the CLI.

   ```shell
   cd personal-finance-tracker
   ```

3. Install all the dependencies using npm.

   ```shell
   npm install
   ```

4. Rename the `.env.example` file as `.env` in the main project folder to use the environment variables in the React application.

5. To run the tests using Vitest and MSW for the React application.

   ```shell
   npm run test
   ```

6. Open the backend folder of the project either in a different instance of the code editor or in a different instance of the CLI that you are using.

7. Install all the dependencies using bundle in the backend folder.

   ```shell
   bundle install
   ```

8. Rename the `.env.example` file as `.env` in the backend folder to use the environment variables in the Rails server.

9. Create a `user` with `password` and a `database` using the created `user` as owner in the PostgreSQL database since those are required to connect to the database. For this, you can either use the default values from the `env.example` file or use different values. Also, values of other variables can also be either used from the `env.example` file or different values based on your preference.

10. Run the database migrations for the Rails application.

   ```shell
   bin/rails db:migrate
   ```

11. Open a different instance of the CLI in the code editor that you are using and run the Rails server.

    ```shell
    bin/rails server
    ```

12. Open a different instance of the CLI in the code editor that you are using and run the Sidekiq service to run the background workers in the Rails application.

    ```shell
    bundle exec sidekiq
    ```

13. Go to the main project folder which is already open in other instance of the code editor and run the React application.

    ```shell
    npm run start
    ```

14. After the React application has started, open any browser and go to `http://localhost:5173` to access the application.<br /><br />

To setup the project using Docker:

1. Clone the project's repository.

   ```shell
   git clone https://github.com/rajatyadav01/personal-finance-tracker.git
   ```

2. Go to the project folder using the CLI.

   ```shell
   cd personal-finance-tracker
   ```

3. Run the project using docker-compose.

   ```shell
   docker-compose up --build
   ```

4. After all the containers have been started, open any browser and go to `http://localhost:5173` to access the application.
