export default `
schema {
  query: RootQueryType
}

type Address {
  id: String!
  line1: String!
  line2: String
  city: String!
  state: String!
  zip: String!
}

type Pet {
  id: String!
  age: Int!
  name: String!
  type: String!
  weight: Float!
}

type Person {
  id: String!
  address: Address!
  age: Int!
  firstName: String!
  lastName: String!
  pets: [Pet]
}

type RootQueryType {
  person(id: ID!): Person

  people(lastName: String, pageSize: Int): [Person]

  peopleSameAgeAsDogYears: [Person]
}`;
