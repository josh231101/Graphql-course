export const typeDefs = `#graphql
    type Game {
        id: ID!
        title: String!
        platform: [String!]!
        reviews: [Review!]
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        game: Game!
        author: Author!
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Review!]
    }

    type Query {
        reviews: [Review] # Returns a list of all reviews
        review(id: ID!): Review
        games: [Game]
        game(id: ID!): Game
        authors: [Author]
        author(id: ID!): Author
    }

    # The type Mutation is used to define the mutations that can be performed on the data.
    # Mutations are used to create, update, or delete data in the GraphQL API
    type Mutation {
        addGame(game: AddGameInput!): Game
        deleteGame(id: ID!): [Game]
        updateGame(id: ID!, edits: EditGameInput!): Game
    }

    # input types are used to define the structure of the input data for mutations
    input AddGameInput {
        title: String!
        platform: [String!]!
    }

    input EditGameInput {
        title: String
        platform: [String!]
    }
`

// The type Query is the entry point for all GraphQL queries.
// It defines the root fields that can be queried in the GraphQL API.
// Defines the entry point for all GraphQL queries. and defines the output types for the queries.


// There are 5 main types:
/**
 * int: Represents a whole number
 * float: Represents a floating-point number
 * string: Represents a sequence of characters
 * boolean: Represents a true or false value
 * ID: Represents a unique identifier, often used for object IDs in databases
 */