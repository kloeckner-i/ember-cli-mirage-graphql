import createGraphQLHandler from 'ember-cli-mirage-graphql/handler';
import schema from 'dummy/gql/schema';
import { contextSet, reduceKeys } from 'ember-cli-mirage-graphql/utils';

const adaptPersonAttrs = (attrs) =>
  reduceKeys(attrs, (_attrs, key) =>
    contextSet(_attrs, key === 'lastName' ? 'surname' : key, attrs[key]), {});

const OPTIONS = {
  fieldsMap: {
    OrderConnection: {
      categories(_, db, parent) {
        let customerId = parent.id;
        let categories = db.orderCategories.filter(({ order }) =>
          order.customer.id === customerId);

        return categories;
      }
    },
    Person: {
      lastName: 'surname',
      pets: 'animals'
    },
    numPeople: (_, db) => db.people.length,
    peopleSameAgeAsDogYears: (people) => {
      let records = people.filter((person) =>
        !!person.pets.filter(({ age, type }) =>
          type === 'dog' && age * 7 === person.age).length);

      return records;
    }
  },
  mutations: {
    updatePerson: (people, { id, personAttributes }) =>
      people.update(id, adaptPersonAttrs(personAttributes))
  },
  argsMap: {
    Person: {
      pageSize: (people, variableName, pageSize) => people.slice(0, pageSize),
      lastName: 'surname'
    }
  },
  scalarMocks: {
    Date: () => {
      return '2019-01-01'
    }
  }
};

export default createGraphQLHandler(schema, OPTIONS);
