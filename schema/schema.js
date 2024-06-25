const graphql = require('graphql');
//dummy data
var usersData = [
    {id:'1',name:'Bond',age:36, profession: 'profession 1'},
    {id:'13',name:'Anna',age:36, profession: 'profession 2'},
    {id:'211',name:'Bella',age:36, profession: 'profession 3'},
    {id:'19',name:'Gina',age:36, profession: 'profession 4'},
    {id:'150',name:'Georgina',age:36, profession: 'profession 5'},
]
var hobbiesData = [
    {id: '1', title: 'Programming', description: 'description 1', userId: '150'},
    {id: '2', title: 'Programming', description: 'description 2', userId: '211'},
    {id: '3', title: 'Programming', description: 'description 3', userId: '211'},
    {id: '4', title: 'Programming', description: 'description 4', userId: '13'},
    {id: '5', title: 'Programming', description: 'description 5', userId: '1'},
    {id: '6', title: 'Programming', description: 'description 6', userId: '150'}
]
var postsData = [
    {id:'1', comment:'comment 1', userId: '1'},
    {id:'2', comment:'comment 2', userId: '1'},
    {id:'3', comment:'comment 3', userId: '19'},
    {id:'4', comment:'comment 4', userId: '211'},
    {id:'5', comment:'comment 5', userId: '1'},
]
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql;
//create types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'Documentation for user...',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},

        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent, args) {
                return hobbiesData.filter(hD=>hD.userId === parent.id);
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return postsData.filter(pD=>pD.userId === parent.id);
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'Hobby description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type: GraphQLString},
        user: { 
            type: UserType,
            resolve(parent, args){
                return usersData.find(uD => uD.id === parent.userId);
            }

        }
    })
});
//post type
const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: { 
            type: UserType,
            resolve(parent, args){
                return usersData.find(uD => uD.id === parent.userId);
            }

        }
    })
});
//RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return usersData.find(uD => uD.id === args.id);
                //we reolve with data
                //get and return data from datasource
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent,args){
                return usersData;
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return hobbiesData.find(hD => hD.id === args.id);
                //return data from our hobby
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent,args){
                return hobbiesData;
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return postsData.find(pD => pD.id === args.id);
                //return data from our posts
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent,args){
                return postsData;
            }
        },
    }
});

//Mutations
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLString},
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }

                return user;
            }
        },
        createPost: {
            type: PostType,
            args: {
                comment: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let post = {
                    comment: args.comment,
                    userId: args.userId
                }

                return post;
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args){
                let hobby = {
                    userId: args.userId
                }

                return hobby;
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
