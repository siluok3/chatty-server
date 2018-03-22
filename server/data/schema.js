export const Schema = [`
    #declare custom scalars
    scalar Date
    
    type Group {
        id: Int!
        name: String
        users: [User]!
        messages: [Message]
    }
    
    type User {
        id: Int!
        email: String!
        username: String #We don't add the password because we don;t want to expose it
        messages: [Message]
        groups: [Group]
        friends: [User]
    }
    
    type Message {
        id: Int!
        to: Group!
        from: User!
        text: String!
        createdAt: Date!
    }
    
    type Query {
        #Return a user by email or id
        user(email: String, id: Int): User
        messages(groupId: Int, userId: Int): [Message]
        group(id: Int!): Group
    }
    
    type Mutation {
        #Send a message to a group
        createMessage( text: String!, userId: Int!, groupId: Int!): Message
    }
    
    schema {
        query: Query
        mutation: Mutation
    }
`];

export default Schema;