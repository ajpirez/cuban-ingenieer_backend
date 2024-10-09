<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

<h1 align="center"> Nestjs Authentication and Authorization Module with TypeORM(PostgreSQL) and Redis </h1>

## Description



Every time a user uploads a file, a cron job runs every 1 minute to:

    Compress all uploaded files (excluding .zip files) into ZIP format
    Delete the original files after compression
    Notify the frontend via SSE once the file has been compressed

All files not in ZIP format are added to a Bull queue for processing.

## Steps to Run the Application

1. **Clone the repository**: Use git clone command to clone the repository to your local machine.

```bash
git clone git@github.com:ajpirez/cuban-ingenieer_backend.git
```

2. **Enter the project folder and copy .env.example as .env**:

```bash
cd my-app
cp .env.example .env
```

3. **Install dependencies**: Run any of the following commands to install all the necessary dependencies.

```bash
npm install
```
```bash
yarn install
```
```bash
pnpm install
```

4. **Run docker-compose**: Use the following command to start the Docker containers.

```bash
docker-compose up -d
```

5.  **Migrations**
### Generate a new migration
```bash
npm run typeorm -- --dataSource=src/database/data-source.ts migration:generate .\src\database\migrations\(name)
```

###  Run migrations
```bash
npm run typeorm -- --dataSource=src/database/data-source.ts migration:run
```

6. **Run the application in development mode**: Use any of the following commands to start the application in development mode.

```bash
npm run start:dev
```
```bash
yarn start:dev
```
```bash
pnpm start:dev
```

