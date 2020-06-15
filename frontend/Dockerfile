# Use NodeJS base image
FROM node:13

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying
# package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy app source
COPY . .
RUN npm run build



# Bind the port that the image will run on
EXPOSE 80

# Define the Docker image's behavior at runtime
FROM nginx:alpine
COPY --from=0  /usr/src/app/build /usr/share/nginx/html