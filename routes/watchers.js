const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = require('graphql');
const GitHub = require('../github');

const WatcherType = new GraphQLObjectType({
    name: 'Watcher',
    fields: () => ({
      name: { type: GraphQLString },
      avatar_url: { type: GraphQLString },
      profile_url: { type: GraphQLString }
    })
});


const WatchersType = new GraphQLObjectType({
    name: 'Watchers',
    fields: () => ({
        count: { type: GraphQLInt },

        watcher: {
            type: new GraphQLList(WatcherType),
            resolve: async () => {
                return await GitHub.stargazers().then(data => {
                    if (Reflect.ownKeys(data).includes('message') && Reflect.ownKeys(data).length == 2) {
                        console.log('API rate limit');
                      return [{ message: 'API rate limit' }];
                    } else {
                        let watcher = [];
            
                        for (const star of data) {
                            watcher.push({
                                avatar_url: star?.avatar_url || null,
                                profile_url: star?.html_url || null,
                                name: star?.login || null
                            });
                        }
            
                        return watcher;
                    }
                });
            }
        }
    })
});


module.exports = WatchersType;