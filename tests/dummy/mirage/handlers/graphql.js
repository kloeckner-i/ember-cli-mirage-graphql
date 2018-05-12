import createGraphQLHandler from 'ember-cli-mirage-graphql/handler';
import schema from 'dummy/gql/schema';

const OPTIONS = {
  fieldsMap: {
    peopleSameAgeAsDogYears: (people) => people.filter((person) =>
      !!person.pets
        .filter(({ type }) => type === 'dog')
        .filter((dog) => dog.age * 7 === person.age).length),
    Person: {
      pets: 'animals'
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
