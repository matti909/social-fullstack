import fs from "fs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { MapperKind, getDirective, mapSchema } from "@graphql-tools/utils";
import { ApolloError, gql } from "apollo-server-express";
import { GraphQLSchema, defaultFieldResolver } from "graphql";
import resolvers from "./resolvers";
/* 
function authDirective() {
  return {
    authDirectiveTypeDefs: gql`
      directive @auth on FIELD_DEFINITION
    `,
    authDirectiveTransformer: (schema: GraphQLSchema) =>
      mapSchema(schema, {
        [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
          const directiveName = "auth";
          const authDirective = getDirective(
            schema,
            fieldConfig,
            directiveName
          )?.[0];
          if (authDirective) {
            const { resolve = defaultFieldResolver } = fieldConfig;
            fieldConfig.resolve = (source, args, context, info) => {
              if (!context.authUser) {
                throw new ApolloError(
                  "User is not authenticated",
                  "USER_NOT_AUTHENTICATED"
                );
              }
              return resolve(source, args, context, info);
            };
            return fieldConfig;
          }
        },
      }),
  };
} 
const { authDirectiveTypeDefs, authDirectiveTransformer } = authDirective();
*/
const typeDefs = gql`
  ${fs.readFileSync(__dirname.concat("/schema.graphql"), "utf8")}
`;

let schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: [typeDefs],
  resolvers: resolvers,
});

export default schema;
