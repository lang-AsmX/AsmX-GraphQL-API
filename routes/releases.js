const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const Github = require('../github');

const AssetsType = new GraphQLObjectType({
    name: 'Assets',
    fields: () => ({
      name: { type: GraphQLString },
      download_count: { type: GraphQLInt },
      created_at: { type: GraphQLString },
      updated_at: { type: GraphQLString },
      browser_download_url: { type: GraphQLString }
    })
});


const ReleaseType = new GraphQLObjectType({
    name: 'Releases',
    fields: () => ({
        name: { type: GraphQLString },
        prerelease: { type: GraphQLString },
        tag_name: { type: GraphQLString },
        created_at: { type: GraphQLString },
        published_at: { type: GraphQLString },
        assets: { type: new GraphQLList(AssetsType) }
    })
});


module.exports = ReleaseType;