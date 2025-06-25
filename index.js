import { ApolloServer } from "@apollo/server"; // Setup and configure Apollo Server
import { startStandaloneServer } from "@apollo/server/standalone"; // Startup the server to listen for requests

// What is Apollo Server?
// Apollo Server is a community-driven, open-source GraphQL server that works with any GraphQL
// What is GraphQL?
// GraphQL is a query language for APIs and a runtime for executing those queries with your existing

// types
import { typeDefs } from "./schema.js"; // Import the GraphQL schema definitions
// server setup

// import dummy bd
import db from "./_db.js"; // Import the dummy database

const resolvers = {
  // Define resolvers for the type queries defined in typeDefs
  Query: {
    games() {
      return db.games;
    },
    reviews() {
      return db.reviews;
    },
    authors() {
      return db.authors;
    },
    // On every query we can get the parent object, arguments, context, and info
    // parent: The result of the previous resolver in the chain (if any)
    // args: An object containing the arguments passed to the field in the query
    // context: An object shared by all resolvers in a query, useful for passing authentication
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
  },
  Game: {
    reviews(parent) {
        // parent is the game object returned by the game resolver
        // We can use it to find the reviews for that game
        return db.reviews.filter((review) => review.game_id === parent.id);
    }
  },
  Author: {
    reviews(parent) {
        // parent is the author object returned by the author resolver
        // We can use it to find the reviews written by that author
        return db.reviews.filter((review) => review.author_id === parent.id);
    }
  },
  Review: {
    game(parent) {
      // parent is the review object returned by the review resolver
      // We can use it to find the game for that review
      return db.games.find((game) => game.id === parent.game_id);
    },
    author(parent) {
      // parent is the review object returned by the review resolver
      // We can use it to find the author of that review
      return db.authors.find((author) => author.id === parent.author_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
        db.games = db.games.filter((game) => game.id !== args.id);
        // After deleting the game, we return the updated list of games
        return db.games;
    },
    addGame(_, args) {
      // Create a new game object with a unique ID and the provided title and platform
      const newGame = {
        ...args.game, // Spread the properties from the input object
        id: String(db.games.length + 1), // Generate a new ID based on the
      };
      // Add the new game to the database
      db.games.push(newGame);
      // Return the newly added game
      return newGame;
    },
    updateGame(_, args) {
      // Find the index of the game to be updated
      const gameIndex = db.games.findIndex((game) => game.id === args.id);
      // If the game is not found, return null
      if (gameIndex === -1) return null;
      // Update the game with the provided edits
      const updatedGame = {
        ...db.games[gameIndex], // Keep existing properties
        ...args.edits, // Apply the edits from the input object
      };
      // Replace the old game with the updated one in the database
      db.games[gameIndex] = updatedGame;
      // Return the updated game
      return updatedGame;
    },
  }
};

const server = new ApolloServer({
  // typeDefs: Description of our data types and their relationships of the GraphQL API
  // typeDefs are written in GraphQL Schema Definition Language (SDL)
  // the schema defines the structure and types of the data that can be queried
  typeDefs,
  // resolvers: Functions that resolve the data for the types defined in typeDefs
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀 Server ready at ${url}`); // Log the server URL
