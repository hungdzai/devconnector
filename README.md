# DevConnector REST API

DevConnector is a simple social network developed for developers. It allows users to register and log into a web client, update personal profile with experience and education history, browse profiles of other users, and post status to the shared feed.

The project is split into 2 parts:

1. [The Frontend]
   A basic React client web application which consumes the RestAPI Backend.
2. [The RestAPI Backend]
   A Node-Express server which can be deployed to a cloud service.

---

## Getting Setup

### Installing project dependencies

This project uses NPM to manage software dependencies. NPM Relies on the package.json file located in the root of this repository. After cloning, open your terminal and run:

```bash
cd frontend
npm install
```

```bash
cd backend
npm install
```

> _tip_: **npm i** is shorthand for **npm install**

## Running the Locally

To run the app locally in developer mode, open terminal and run:

```bash
cd  backend
npm run dev
```

Spin up another terminal

```bash
cd frontend
npm start
```
