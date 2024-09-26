# Human Resources Management System 2 (HRMS - 2)

## Description

Its **imperative** that you read this `README.md` file before you proceed to use this project.

This means.. before cloning, forking or downloading this project, you must read this `README.md` file.

This is a project is a module/part of the Human Resources Management System (HRMS) project
which focuses on the recruitment and hiring process.

## Installation

Instructions for installing and setting up your project.
I will try to keep this as detailed as possible.

Clone this project from github

HTTPS

```
git clone https://github.com/freight-capstone/hr2.git
```

**or**

SSH

```
git clone git@github.com:freight-capstone/hr2.git
```

Take a note that client and server are in different folders.

`Client` contains the front-end of the project.

`Server` contains the back-end of the project.

Each folder has its own `.env` file for environment variables which you can edit to suit your need. its purpose is to store sensitive information that should not be exposed to the public.

copy the `.env.example` file to `.env` and edit the variables to suit your need.

for client, the `.env` file is located in the `client` folder should look like this:

```
NODE_ENV=development

SERVER_URL=http://localhost:8000
```

**NODE_ENV** is the environment in which the application is running.

**SERVER_URL** is the URL of the server.

For server, the `.env` file is located in the `server` folder should look like this:

```
NODE_ENV=development
JWT_SECRET=

MONGODB_URI=mongodb+srv://username:password@cluster0.8oxcs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

This is fine as it is as default.

**JWT_SECRET** is a secret key that is used to sign the JWT token, which serves as a means of authentication. This is a security measure to ensure that only authorized users can access the protected routes. ITS VERY IMPORTANT THAT YOU CHANGE THIS TO SOMETHING ELSE and not leave it as it is.

To generate it.. either use a random string generator or use a password generator. but the best is to use 16 characters or more.

It may look like this:

```
303fed95dd0aeb6c9b92bdef9a21e11e9df08f90522761136277a92590908b38
```

Which I generated using a Node.js package called `crypto` using this command:

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

paste it the generated string to the **JWT_SECRET** variable in the `.env` file.

Now, **MONGODB_URI** is the URI of the MongoDB database that the application will use to store the data.
You will need to create a MongoDB database and get the URI from the MongoDB Atlas dashboard.

Refer to the [MongoDB documentation](https://www.mongodb.com/docs/manual/reference/connection-string/) for more information on how to get the URI.

or this [video](https://www.youtube.com/watch?v=s0anSjEeua8)

If all is well, you can now run the project.

Server first.

I recommend that you copy and run each command one by one as sometimes it may not work, just because it works in my machine doesn't mean it will work in yours, specially if you are using a different operating system.

```
cd /path to folder/server
npm install
npm run dev
```

If there's any error, you should see something like this:

![client](./assets/server.png)

then Client,

```
cd /path to folder/client
npm install
npm run seed:run
npm run dev
```

If there's any error, you should see something like this:
![client](./assets/client.png)

now click or copy the link in the terminal and paste it in your browser.

## Features

Not much to say here, but if you have any features you want to add, please feel free to submit an issue using the ISSUE_TEMPLATE.

Check trello page for progress

[Trello Board](https://trello.com/invite/b/66f4e3ebeddcacce9a664ca5/ATTI9d29af124fb1c294754ab401d9fafee4BD718819/hr2)

No Registration feature and I assume there will never be, that's the ADMIN's job to do.
