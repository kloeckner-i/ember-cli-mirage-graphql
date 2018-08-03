export default `
type Address {
  id: ID!
  line1: String!
  line2: String
  city: String!
  state: String!
  zip: String!
}

type Customer implements Node {
  id: ID!
  name: String!
  orders(after: String, before: String, first: Int, last: Int): OrderConnection
}

type LineItem {
  name: String!
  quantity: Int!
}

type LineItemConnection {
  edges: [LineItemEdge]
  pageInfo: PageInfo!
}

type LineItemEdge {
  cursor: String!
  node: LineItem
}

interface Node {
  id: ID!
}

type Order implements Node {
  id: ID!
  lineItems(after: String, before: String, first: Int, last: Int): LineItemConnection
  number: Int!
  total: Float
}

type OrderCategory {
  id: ID!
  name: String!
}

type OrderEdge {
  cursor: String!
  node: Order
}

type OrderConnection {
  categories: [OrderCategory]
  edges: [OrderEdge]
  pageInfo: PageInfo!
}

type PageInfo {
  endCursor: String
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
}

type Pet {
  id: ID!
  age: Int!
  name: String!
  type: String!
  weight: Float!
}

type Person {
  id: ID!
  address: Address!
  age: Int!
  firstName: String!
  lastName: String!
  pets: [Pet]
}

input PersonAttributes {
  firstName: String
  lastName: String
  age: Int
}

type RootMutationType {
  updatePerson(id: ID!, personAttributes: PersonAttributes!): Person
}

type RootQueryType {
  node(id: ID!): Node

  person(id: ID!): Person

  people(lastName: String, pageSize: Int): [Person]

  peopleSameAgeAsDogYears: [Person]
}`;
