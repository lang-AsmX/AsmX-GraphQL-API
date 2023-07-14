const { GraphQLObjectType, GraphQLString } = require('graphql');

const TagType = new GraphQLObjectType({
    name: 'Tag',
    fields: () => ({
      name: { type: GraphQLString },
      zipball_url: { type: GraphQLString },
      tarball_url: { type: GraphQLString }
    })
});


module.exports = TagType;