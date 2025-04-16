FROM node
WORKDIR /user/app
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 5173
CMD [ "npm", "run", "start:dev" ]