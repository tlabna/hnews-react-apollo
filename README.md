# HNews React & Apollo

A simple fully-featured Hackernews clone built with React and Apollo Client

| <center>Features</center>                   |
| ------------------------------------------- |
| Displaying a list of links                  |
| Signup and Authentication (JWT)             |
| Creating new links                          |
| Voting on links                             |
| Pagination                                  |
| Realtime updates with GraphQL subscriptions |

## Running the App

### 1. Clone or download this repository

### 2. Install dependencies & Deploy the Prisma database API

```sh
cd hnews-react-apollo/server
yarn install
yarn prisma deploy
```

When prompted where (i.e. to which _Prisma server_) you want to deploy your service, choose the **Demo server** which can be used for free in Prisma Cloud (_Note. You will be asked to register if you do not have an account_). For the following prompts in the terminal you can select the suggested values by hitting **Enter**. (If you have Docker installed, you can also choose to deploy Prisma locally by _Creating a new database_.)

### 3. Set the Prisma API endpoint

The `prisma deploy` command wrote the endpoint property into `server/database/prisma.yml`. Copy it from there and paste it into `server/src/index.js` where it's used to instantiate the `Prisma` binding. You need to replace the current placeholder `__PRISMA_ENDPOINT__`:

```js
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql",
      endpoint: "__PRISMA_ENDPOINT__",
      secret: "mysecret123"
    })
  })
});
```

### 4. Start the server

Execute the `start` script by running the following command inside the `server` directory:

```sh
yarn start
```

> **Note**: If you want to interact with the GraphQL APIs inside a GraphQL Playground, you can also run `yarn dev`.

### 5. Run the app

With the server running, you can start the app as well. The commands need to be run in a new terminal tab/window inside the root directory `hnews-react-apollo` (since the current tab is blocked by the process running the server):

```sh
npm install
npm start
```

You can now use the app on your browser at `http://localhost:3000`.
