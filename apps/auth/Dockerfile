FROM uselagoon/node-18

WORKDIR /usr/src/app

COPY . . 

RUN npm install

RUN npm i dotenv-cli -g

RUN npm run build auth

CMD ["npm", "run", "docker:run"]
