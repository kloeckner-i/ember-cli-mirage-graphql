/**
 * This base class defines the interface for a GraphQL Auto Resolver strategy.
 * A strategy implementation is expected to contain methods for resolving
 * certain types from a GraphQL schema.
 * 
 * Those types are: 
 *   - `GraphQLInterfaceType`
 *   - `GraphQLList`
 *   - `GraphQLNonNull`
 *   - `GraphQLObjectType`
 *   - `GraphQLUnionType`
 * 
 * When resolvers are added to a schema by GraphQL Auto Resolver, those
 * resolvers delegate to the methods implemented by the strategy.
 */
export default class BaseGraphQLAutoResolveStrategy {
  constructor(options) {
    this.logger = options?.logger || console;
    this.suppressWarnings = options?.suppressWarnings || false;
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} args
   * @param {*} context 
   * @param {*} info 
   */
  resolveGraphQLInterfaceType(obj, args, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn(
        'Method `resolveGraphQLInterfaceType` is not implemented'
      );
    }
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} args 
   * @param {*} context 
   * @param {*} info 
   */
  resolveGraphQLList(obj, args, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn('Method `resolveGraphQLList` is not implemented');
    }
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} args 
   * @param {*} context 
   * @param {*} info 
   */
  resolveGraphQLNonNull(obj, args, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn('Method `resolveGraphQLNonNull` is not implemented');
    }
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} args 
   * @param {*} context 
   * @param {*} info 
   */
  resolveGraphQLObjectType(obj, args, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn('Method `resolveGraphQLObjectType` is not implemented');
    }
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} args
   * @param {*} context 
   * @param {*} info 
   */
  resolveGraphQLUnionType(obj, args, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn('Method `resolveGraphQLUnionType` is not implemented');
    }
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} context 
   * @param {*} info 
   */
  resolveTypeForGraphQLInterfaceType(obj, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn(
        'Method `resolveTypeForGraphQLInterfaceType` is not implemented'
      );
    }
  }

  /**
   * TODO: TBD
   * 
   * @param {*} obj 
   * @param {*} context 
   * @param {*} info 
   */
  resolveTypeForGraphQLUnionType(obj, context, info) { // eslint-disable-line no-unused-vars
    if (!this.suppressWarnings) {
      this.logger.warn(
        'Method `resolveTypeForGraphQLUnionType` is not implemented'
      );
    }
  }

  /**
   * This hook is called when a resolver is created. Implement this in your own
   * strategy if you need special functionality related to the type for the
   * newly created resolver.
   * 
   * @param {GrahQLSchema} schema
   * @param {GraphQLInterfaceType|GraphQLList|GraphQLNonNull|GraphQLObjectType|GraphQLUnionType} type
   * @param {Object} resolver
   */
  resolverCreated(schema, type, resolver) {} // eslint-disable-line no-unused-vars
}
