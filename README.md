# Location search with docker, mongodb, typescript, expressjs, jest
## how to setup 


## Features

- Get location by radius and name
- unit test

## Installation 
### Installation with docker
Requires [Node.js](https://nodejs.org/) v10+,  [Docker](https://www.docker.com/) to run. 

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/vipin733/suggestions_location.git
cd suggestions_location
npm i
```

## RUNING PROJECT

Root folder
##### environment development 
```sh
cp .example.docker.env .env.development.local
docker-compose up --build
```

##### environment production 
change env keys 
DB_DATABASE = dev => DB_DATABASE = prod
```sh
cp .example.docker.env .env.production.local
docker-compose -f docker-compose.prod.yml up --build
```

##### environment test 
after copy env 
change env keys 

MAX_CALL_API=100 =>MAX_CALL_API=1 
MAX_TIME_API_CALL=15 => MAX_TIME_API_CALL=1
DB_DATABASE = dev => DB_DATABASE = test
```sh
cp .example.docker.env .env.test.local
docker-compose -f docker-compose.prod.yml up --build
```

### Installation without docker
Requires [Node.js](https://nodejs.org/) v10+,  [MongoDB](https://www.mongodb.com/) to run. 

Install the dependencies and devDependencies and start the server.

```sh
git clone https://github.com/vipin733/suggestions_location.git
cd suggestions_location
npm i
```

## RUNING PROJECT

Root folder
##### environment development 
```sh
cp .example.env .env.development.local
npm run dev
```

##### environment production 
change env keys 
DB_DATABASE = dev => DB_DATABASE = prod
```sh
cp .example.env .env.production.local
npm run start
```

##### environment test 
after copy env 
change env keys 

MAX_CALL_API=100 =>MAX_CALL_API=1 
MAX_TIME_API_CALL=15 => MAX_TIME_API_CALL=1
DB_DATABASE = dev => DB_DATABASE = test
```sh
cp .example.env .env.test.local
npm run test
```
