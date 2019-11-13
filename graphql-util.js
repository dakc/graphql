const graphql = require('graphql');
const graphqlHTTP = require("express-graphql");
const { authors, books} = require("./db");

// define book type
var BookType = new graphql.GraphQLObjectType({
    name: "Book",
    fields: {
        id: {type: graphql.GraphQLInt},
        name:{type: graphql.GraphQLString},
        authorId: {type: graphql.GraphQLInt},
        authorName: {
            type: graphql.GraphQLString,
            resolve: (book) => {
                var authr = authors.find(author => author.id === book.authorId);
                return authr.name || "";
            }
        }
    }
});

// define author type
var AuthorType = new graphql.GraphQLObjectType({
    name: "Author",
    fields: {
        id: {type: graphql.GraphQLInt},
        name: {type: graphql.GraphQLString},
        books: {
            type: new graphql.GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
        }
    }
});

// define query type
var RootQueryType = new graphql.GraphQLObjectType({
    name: "Query",
    fields: {
        book:{
            type: BookType,
            description: "A single Book",
            // `args` describes the arguments that the book query accepts
            args: {
                id: {type: graphql.GraphQLInt}
            },
            resolve: function(parent, args){
                return books.find(book => book.id === args.id)
            }
        },
        books:{
            type: new graphql.GraphQLList(BookType),
            description: 'List of All Books',
            resolve: () => books
        },

        author:{
            type: AuthorType,
            description: 'A Single Author',
            args:{
                id: {type: graphql.GraphQLInt}
            },
            resolve: function(parent, args){
                return authors.find(author => author.id === args.id);
            }
        },

        authors: {
            type: new graphql.GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        }
    }
});


var RootMutationType =  new graphql.GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: {
                    type: graphql.GraphQLNonNull(graphql.GraphQLString)
                },
                authorId: {
                    type: graphql.GraphQLNonNull(graphql.GraphQLInt)
                }
            },
            resolve: (parent, args) => {
                const book = {
                    id: books.length + 1,
                    name: args.name,
                    authorId: args.authorId
                }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add an author',
            args: {
                name: {
                    type: graphql.GraphQLNonNull(graphql.GraphQLString)
                }
            },
            resolve: (parent, args) => {
                const author = {
                    id: authors.length + 1,
                    name: args.name
                }
                authors.push(author)
                return author
            }
        }
    })
});

// create schema
var schema = new graphql.GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
});

const graphqlMiddleWare = graphqlHTTP({
    schema: schema,
    graphiql: true
});

module.exports = graphqlMiddleWare;