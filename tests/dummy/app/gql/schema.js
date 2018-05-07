export default `
schema {
  query: RootQueryType
}

type Pet {
  id: String!
  age: Int
  name: String
  type: String
  weight: Float
}

type Person {
  id: String!
  age: Int
  firstName: String
  lastName: String
  pets: [Pet]
}

type RootQueryType {
  person(id: ID!): Person

  people(lastName: String, pageSize: Int): [Person]
}`;
