const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLList } = require('graphql');
const GitHub = require('./github');

const PORT = process.env.PORT || 3000;

const ReleaseType = require('./routes/releases');
const TagType = require('./routes/tags');
const WatchersType = require('./routes/watchers');

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    releases: {
      type: new GraphQLList(ReleaseType),
      resolve: async () => {
        return await GitHub.releases().then(data => {
            if (Reflect.ownKeys(data).includes('message') && Reflect.ownKeys(data).length == 2) {
                console.log('API rate limit');
                return [{ message: 'API rate limit' }];
            } else {
                let resourceReleases = [];
                let count = 0;
    
                for (const release of data) {
                  if (resourceReleases[count] == undefined) resourceReleases[count] = {};
    
                  for (const property of Reflect.ownKeys(release)) {
                    if (['name', 'tag_name', 'created_at', 'published_at', 'prerelease'].includes(property)) resourceReleases[count][property] = release[property];
                  }
                }
    
                return resourceReleases;
            }
        });
      }
    },


    tags: {
      type: new GraphQLList(TagType),
      resolve: async () => {
        return await GitHub.tags().then((data) => {
          let resource = [];
          let count = 0;
      
          if (Reflect.ownKeys(data).includes('message') && Reflect.ownKeys(data).length == 2) {
            return { message: 'API rate limit' };
          } else {
            for (const tag of data) {
              for (const property of Reflect.ownKeys(tag)) {
                if (['name', 'zipball_url', 'tarball_url'].includes(property)) {
                  if (resource[count] == undefined) resource[count] = {};
                  resource[count][property] = tag[property];
                }
              }

              count++;
            }
  
            return resource;
          }
      });
      }
    },


    watchers: {
      type: new GraphQLList(WatchersType),
      resolve: async () => {
        return await GitHub.stargazers().then(data => {
          if (Reflect.ownKeys(data).includes('message') && Reflect.ownKeys(data).length == 2) {
            return { message: 'API rate limit' };
          } else {
            return { count: data?.length || 0 };
          }
        });
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: QueryType
});


const app = express();


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));


app.listen(PORT, () => {
  console.log(` Server reasy on: http://localhost:${PORT}`);
});