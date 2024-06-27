const graphql = require('graphql');
const User = require("../model/user");
const Hobby = require("../model/hobby");
const Post = require("../model/post");
//dummy data
// var usersData = [
//     {id:'1',name:'Bond',age:36, profession: 'profession 1'},
//     {id:'13',name:'Anna',age:36, profession: 'profession 2'},
//     {id:'211',name:'Bella',age:36, profession: 'profession 3'},
//     {id:'19',name:'Gina',age:36, profession: 'profession 4'},
//     {id:'150',name:'Georgina',age:36, profession: 'profession 5'},
// ]
// var hobbiesData = [
//     {id: '1', title: 'Programming', description: 'description 1', userId: '150'},
//     {id: '2', title: 'Programming', description: 'description 2', userId: '211'},
//     {id: '3', title: 'Programming', description: 'description 3', userId: '211'},
//     {id: '4', title: 'Programming', description: 'description 4', userId: '13'},
//     {id: '5', title: 'Programming', description: 'description 5', userId: '1'},
//     {id: '6', title: 'Programming', description: 'description 6', userId: '150'}
// ]
// var postsData = [
//     {id:'1', comment:'comment 1', userId: '1'},
//     {id:'2', comment:'comment 2', userId: '1'},
//     {id:'3', comment:'comment 3', userId: '19'},
//     {id:'4', comment:'comment 4', userId: '211'},
//     {id:'5', comment:'comment 5', userId: '1'},
// ]
const {
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
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
                return Hobby.find({userId : parent.id})
                .then((hobbies) => {
                    if (hobbies.length <= 0) {
                        throw new Error(`hobbies not found`);
                    }
                    return hobbies
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching user');
                });
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find({userId : parent.id})
                .then((posts) => {
                    if (posts.length <= 0) {
                        throw new Error(`posts not found`);
                    }
                    return posts
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching user');
                });
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
                return User.findOne({_id : parent.userId})
                .then((user) => {
                    console.log('user hobbie')
                    console.log(user)
                    if (!user) {
                        throw new Error(`User ID not found`);
                    }
                    return user;
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching user');
                });
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
                return User.findOne({_id : parent.userId})
                .then((user) => {
                    console.log('user post')
                    console.log(user)
                    if (!user) {
                        throw new Error(`User ID not found`);
                    }
                    return user;
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching user');
                });
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
                return User.findOne({_id:args.id})
                .then((user) => {
                    console.log(user)
                    if (!user) {
                        throw new Error(`User ID not found`);
                    }
                    return user
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching user');
                });
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent,args){
                return User.find();
            }
        },
        hobby: {
            type: HobbyType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Hobby.findOne({_id:args.id})
                .then((hobby) => {
                    console.log(hobby)
                    if (!hobby) {
                        throw new Error(`Hobby ID not found`);
                    }
                    return hobby
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching hobby');
                });
            }
        },
        hobbies: {
            type: new GraphQLList(HobbyType),
            resolve(parent,args){
                return Hobby.find();
            }
        },
        post: {
            type: PostType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                return Post.findOne({_id:args.id})
                .then((post) => {
                    console.log(post)
                    if (!post) {
                        throw new Error(`Post ID not found`);
                    }
                    return post
                })
                .catch((err) => {
                    console.error(err);
                    throw new Error('Error searching post');
                });
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve(parent,args){
                return Post.find();
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
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                let user = User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                })
                
                return user.save();
            }
        },
        //update user
        UpdateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString},
            },
            resolve(parent, args){
                return User.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            name: args.name,
                            age: args.age,
                            profession: args.profession
                        }
                    },
                    {new: true}//send back the uodate obj
                )
            }
        },
        //remove user
        RemoveUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const removeUser = User.findByIdAndDelete(args.id).exec();
                if (!removeUser) {
                    throw new "Error"();
                }
                return removeUser;
            }
        },
        createPost: {
            type: PostType,
            args: {
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let post = Post({
                    comment: args.comment,
                    userId: args.userId
                })

                return post.save();
            }
        },
        //update post
        UpdatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                comment: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            comment: args.comment
                        }
                    },
                    {new: true}//send back the uodate obj
                )
            }
        },
        //remove post
        RemovePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const removePost = Post.findByIdAndDelete(args.id).exec();
                if (!removePost) {
                    throw new "Error"();
                }
                return removePost;
            }
        },
        createHobby: {
            type: HobbyType,
            args: {
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args){
                let hobby = Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                })

                return hobby.save();
            }
        },
        //update hobby
        UpdateHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args){
                return Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set:{
                            title: args.title,
                            description: args.description
                        }
                    },
                    {new: true}//send back the uodate obj
                )
            }
        },
        //remove hobby
        RemovePost: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args){
                const removeHobby = Hobby.findByIdAndDelete(args.id).exec();
                if (!removeHobby) {
                    throw new "Error"();
                }
                return removePost;
            }
        },
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
