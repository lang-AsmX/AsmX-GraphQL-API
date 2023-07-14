const { GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt } = require('graphql');
const Github = require('../github');

const AssetType = new GraphQLObjectType({
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
    name: 'Release',
    fields: () => ({
        name: { type: GraphQLString },
        prerelease: { type: GraphQLString },
        tag_name: { type: GraphQLString },
        created_at: { type: GraphQLString },
        published_at: { type: GraphQLString },

        assets: {
            type: new GraphQLList(AssetType),
            resolve: async () => {
                return await Github.releases().then(data => {
                    if (Reflect.ownKeys(data).includes('message') && Reflect.ownKeys(data).length == 2) {
                        return [{ message: 'API rate limit' }];
                    } else {
                        let assets = [];
            
                        for (const release of data) {
                            for (const archive of release['assets']) {
                                assets.push({
                                    name: archive['name'],
                                    download_count: archive['download_count'],
                                    created_at: archive['created_at'],
                                    updated_at: archive['updated_at'],
                                    browser_download_url: archive['browser_download_url']
                                });
                            }
                        }
            
                        return assets;
                    }
                });
            }
        }
    })
});


module.exports = ReleaseType;