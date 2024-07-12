# OnBoardEase (Project Onboarding at Ease)

## Overview

OnBoardEase is a project onboarding web app, with AI chatbot features, aim to help smooth and improve onboarding process for employees (new hire, intern, new project member, etc). The current web app supports two roles: manager and employee. Managers can create projects, assign tasks and add helpful resources. Employees can view assigned projects, tasks, and have access to the chatbot that is customized to answer questions based on employee assigned projects.  


## Tech Stack & Usage

This web app utilizes TypeScript React + Node.js + MongoDB. Please see respective README.md in `frontend` and `backend` folder for more information.

To run frontend:

* `cd frontend`
* `npm install` - download all dependencies from `package.json`
* `npm run` - run and view the app at localhost:3000

To run backend:

* `cd backend`
* `npm install` - download all dependencies from `package.json`
* `npm run start` or `npm run dev-start` to run with nodemon


## Workflow
1. Landing page (signin/signup): users will either sign in or sign up. After signing up, log in as the admin user to approve and assign role.
2. Home page (Manager): As a manager, user can log in, create project and assign it to any registered employees.
3. Home page (Employee): As an employee, user can view assigned projects as well as utilize the chatbot.


## Features/Future Work 
1. User Authorization: In our local development, we added a layer of authorization by requiring admin approval. For future scalability or integration with existing environment, we would integrate Activity Directory or SSO (Single Sign-On) to avoid the overhead of creating and approving accounts.
2. Session Management: In our local development, we added a token to safeguard user authentication and a cookie to improve user experience by extending the session validity for an hour. All these information are stored in local browser. For future scalability, a different strategy should be considered.
3. Security: In our local development, we encrypt and salt user signup password information. In addition, backend routes and resources are protected by requiring an authentication token from frontend requests. For future development, we would further enhance secured transaction by utilizing HTTPS and employing different end-to-end or at-rest, in-transit encryption mechanism. If hosted in the cloud, we would also consider native cloud security solutions.
4. Chatbot Capability: In our local development, the chatbot feature is accomplished by doing a database key word search. For more intelligent and advanced functionalities, we would consider model training and fine tuning.