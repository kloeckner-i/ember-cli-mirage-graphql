# Mock GraphQL with Ember CLI Mirage

[![npm version](https://badge.fury.io/js/ember-cli-mirage-graphql.svg)](https://badge.fury.io/js/ember-cli-mirage-graphql)
[![Build Status](https://travis-ci.org/kloeckner-i/ember-cli-mirage-graphql.svg?branch=master)](https://travis-ci.org/kloeckner-i/ember-cli-mirage-graphql)
[![Coverage Status](https://coveralls.io/repos/github/kloeckner-i/ember-cli-mirage-graphql/badge.svg?branch=master)](https://coveralls.io/github/kloeckner-i/ember-cli-mirage-graphql?branch=master)

This addon is for mocking GraphQL with Ember CLI Mirage.

## Compatibility

* Ember.js v2.16 or above
* Ember CLI v2.13 or above
* Ember CLI Mirage v0.4.7 to v1.1.x
* Node.js v8 or above

## Note

This addon is very early in its development and the code currently supports limited use cases. If you would like to contribute, don't be afraid to trample any existing code. It's quite trampleable.

## Installation

```sh
ember install ember-cli-mirage
ember install ember-cli-mirage-graphql
```

## How It Works

This addon creates a request handler for use with Mirage that takes your GraphQL schema and creates mocks accordingly. In its simplest form, the mocks query data from Mirage's database, by type, and optionally filter records by matching query variables.

## Example Usage

### Quick Example

See the dummy app in this addon's tests folder for a complete example. Open the Mirage folder and notice the added `handlers` folder. This is where we created the GraphQL request handler callback. It can be imported in the Mirage config for use with your GraphQL request handler.

Note: There is no need to create a separate module for your handler, as we did, but we think it's nice to keep all the handler options out of the Mirage config.

### Basic Example

If you're like us, you'll want to create your handler aside from your Mirage config:

```javascript
// /mirage/handlers/graphql.js or wherever you like

import createGraphQLHandler from 'ember-cli-mirage-graphql/handler';
import schema from 'app-name/path-to-your-schema';

export default createGraphQLHandler(schema, /* options = {} */);
```

Note: We use a simple command line tool to download our schema: [get-graphql-schema](https://www.npmjs.com/package/get-graphql-schema).

---

Then import your handler for use in your Mirage config:

```javascript
// /mirage/config.js

import graphQLHandler from './handlers/graphql';

export default function() {
  this.post('/path-to-graphql', graphQLHandler);
}
```

### Handler Options

You may pass in options when creating a request handler. The options take the form of a hash and may contain the following:

```javascript
{
  /*
    `fieldsMap` is used if you need to map a field defined in your
    GraphQL schema to a different field for a record in your Mirage
    database.

    This can happen if, for example, you are migrating from a JSON
    API backend to GraphQL and there are model name conflicts.

    In this example the mapping is for a relationship; however, you
    may map any field type.

    String values will be used to map field names from your query to
    match those in your Mirage database.

    Method values will be used to filter records and will run after
    any variable filtering and related data fetching. This allows for
    complex record filtering that can't be done with variables alone.
    The methods receive 3 arguments:

    1. The resolved records, if any.
    2. Mirage's database.
    3. Its parent record, if any.
   */
  fieldsMap: {
    Person: { // fields are mapped on a per-type basis
      pets: 'animals'
    }
  },
  /*
    `mutations` is an object used to mock mutation functionality you
    might expect from the server. Each method maps directly to a
    named mutation from your schema and receives 3 arguments:

    1. The table from Mirage's database that corresponds to the return
    type of the mutation.
    2. The mutation arguments. These will be mapped per the argsMap
    option, by the return type, if appropriate.
    3. Mirage's database.

    For now, this is the only way to mock mutations with this addon;
    however, we will try to implement some form of default mutation
    functionality, if feasible.
   */
  mutations: {
    updatePerson: (people, args, db) => {
      let { id, personAttributes } = args;

      return [ people.update(id, personAttributes) ];
    }
  },
  /*
    argsMap is used if you need to map arguments defined in your GraphQL
    queries to something other than the corresponding field name on the
    Mirage record. The value you specify in the map can be a string or a
    function.

    The addon uses the arguments to filter records of the given
    type from Mirage's database.

    String values will be used to map argument names to field names
    in case the argument name differs.

    Function values will be used to filter records. The function
    will be passed an array of records, the argument name (key)
    and the argument value.
   */
  argsMap: {
    Person: { // arguments are mapped on a per-type basis
      pageSize: (records, _, pageSize) => records.slice(0, pageSize)
    }
  },
  /*
  `scalarMocks` is used if you have custom scalars and you need to mock them to
   return a default value
  */
  scalarMocks: {
    MyCustomScalar: () => {
      return 'some custom value'
    }
  }
}
```

## Contributing

Any contributors are most welcome!

Please file issues, as appropriate. Feature requests would be nice in the form of use cases. Knowing how you are using GraphQL should help contributors make the addon more capable.

PRs are also welcome, provided they relate to an issue or add functionality for a certain use case, and should generally follow the same coding style as the rest of the addon.

See the [Contributing](CONTRIBUTING.md) guide for details.
