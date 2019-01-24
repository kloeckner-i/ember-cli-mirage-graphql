import createGraphQLHandler from 'ember-cli-mirage-graphql/handler';
import schema from 'dummy/gql/schema';

/*
  TODO

  * Add a string variable map so we can test that
  * Fix whatever reason mutations need to return a list
 */
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
      pets: 'animals'
    },
    peopleSameAgeAsDogYears: (people) => {
      let records = people.filter((person) =>
        !!person.pets.filter(({ age, type }) =>
          type === 'dog' && age * 7 === person.age).length);

      return records;
    }
  },
  mutations: {
    updatePerson: (people, { id, personAttributes }) =>
      [ people.update(id, personAttributes) ]
  },
  varsMap: {
    Person: {
      pageSize: (people, variableName, pageSize) => people.slice(0, pageSize)
    }
  }
};

export default createGraphQLHandler(schema, OPTIONS);
