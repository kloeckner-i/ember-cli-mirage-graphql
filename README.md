# Mock GraphQL with Ember CLI Mirage

[![Build Status](https://travis-ci.org/kloeckner-i/ember-cli-mirage-graphql.svg?branch=master)](https://travis-ci.org/kloeckner-i/ember-cli-mirage-graphql)

This addon is for mocking GraphQL with Ember CLI Mirage.

## Installation

```sh
ember install ember-cli-mirage
ember install ember-cli-mirage-graphql
```

## How It Works

This addon creates a request handler for use with Mirage that takes your GraphQL scehma and creates mocks accordingly. In its simplest form, the mocks query data from Mirage's database, by type, and optionally filter records by matching query variables.

## Example Usage

### Quick Example

See the dummy app in this addon's tests folder for a complete example. Open the Mirage folder and notice the added `handlers` folder. This is where we created the GraphQL request handler callback. It can be imported in the Mirage config for use with your GraphQL request handler.

Note: There is no need to create a separate module for your handler, as we did, but we think it's nice to keep all the handler options out of the Mirage config.

### Basic Example

If you're like us, you'll want to create your handler aside from your Mirage config:

```javascript
// /mirage/handlers/graphql.js or wherever you like

import createGraphQLHandler from 'ember-cli-mirage-graphql/handler';
import schmea from 'app-name/path-to-your-schema';

export default createGraphQLHandler(schema, /* options = {} */);
```

Note: We use a simple command line tool to download our schema and then we wrap it in a template string and save it as a JavaScript module. The tool can be found here: [get-graphql-schema](https://www.npmjs.com/package/get-graphql-schema).

---

Then import your handler for use in your Mirage config:

```javascript
// /mirage/config.js

import graphQLHandler from './handlers/grapqhl';

export default function() {
  this.post('/path-to-graphql', graphQLHandler);
}
```

### Handler Options

You may pass in options when creating a request handler. The options take the form of a hash and may contain the following:

```javascript
{
  /*
    fieldsMap is used if you need to map a field defined in your
    GraphQL schema to a different field for a record in your Mirage
    database.

    This can happen if, for example, you are migrating from a JSON
    API backend to GraphQL and there are model name conflicts.

    In this example the mapping is for a relationship; however, you
    may map any field type.

    String values will be used to map field names from your query to
    match those in your Mirage database.

    Function values will be used to filter records and will run after
    any variable filtering and related data fetching. This allows for
    complex record filtering that can't be done with variables alone.
   */
  fieldsMap: {
    Person: { // fields are mapped on a per-type basis
      pets: 'animals'
    }
  },
  /*
    varsMap is used if you need to map request variables defined
    in your GraphQL queries. The value you specify in the map can
    be a string or a function.

    The addon uses the variables to filter records of the given
    type from Mirage's database.

    String values will be used to map variable names to field names
    in case the variable name differs.

    Function values will be used to filter records. The function
    will be passed an array of records, the variable name (key)
    and the variable value.
   */
  varsMap: {
    Person: { // variables are mapped on a per-type basis
      pageSize: (records, _, pageSize) => records.slice(0, pageSize)
    }
  }
}
```

## TODO

* Support mutations. As of now, the addon only supports queries. As we at Koeckner need to support mutations, this will be actively worked on per our use cases.

## Contributing

Any contributors are most welcome!

Please file issues, as appropriate. Feature requests would be nice in the form of use cases. Knowing how you are using GraphQL should help contributors make the addon more capable.

PRs are also welcome, provided they relate to an issue or add functionality for a certain use case, and should generally follow the same coding style as the rest of the addon.
