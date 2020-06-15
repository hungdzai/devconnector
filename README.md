# DevConnector REST API [![Build Status](https://travis-ci.org/hungapp/devconnector.svg?branch=master)](https://travis-ci.org/hungapp/devconnector)

DevConnector is a simple social network developed for developers. It allows users to register and log into a web client, update personal profile with experience and education history, browse profiles of other users, and post status to the shared feed.

The project is split into 2 parts:

1. [The Frontend]
   A basic React client web application which consumes the RestAPI Backend.
2. [The RestAPI Backend]
   A Node-Express server which can be deployed to a cloud service.

---

## Getting Setup

## Running Locally with Docker

```bash
docker-compose up
```

Access the site at: [localhost:80](http://localhost:80)

## Running Locally with npm

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

```bash
cd  backend
npm run dev
```

Spin up another terminal

```bash
cd frontend
npm start
```
