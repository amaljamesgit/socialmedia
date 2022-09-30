var db = require('../config/connection')
var collection=require('../config/collections')
var objectId = require('mongodb').ObjectID
module.exports = {

    addPost: (post, callback) => {
        
        console.log(post);
        db.get().collection('post').insertOne(post).then((data) => {
            // console.log(data)
            callback(data.insertedId)
        })
    },

    getAllPost:()=>{
        return new Promise(async (resolve, reject) => {
            let post = await db.get().collection(collection.POST_COLLECTION).find().toArray()
            resolve(post)
   
        })
    },
    getPost:(userId)=>{
        return new Promise(async (resolve, reject) => {
            let postItems = await db.get().collection(collection.POST_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$post'
                },
                {
                    $project: {
                        text: '$post.text',
                        date: '$post.date'
                    }
                },
                {
                    $lookup: {
                        from: collection.POST_COLLECTION,
                        localField: 'text',
                        foreignField: '_id',
                        as: 'post'
                    }
                },
                {
                    $project: {
                        text: 1, date: 1, post: { $arrayElemAt: ['$post', 0] }
                    }
                }



            ]).toArray()

            resolve(postItems)
        })
    },

           
    getAllUser:()=>{
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(user)
   
        })
    },
    deletePost: (postId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.POST_COLLECTION).deleteOne({ _id: objectId(postId) }).then((response) => {
                console.log(response)
                resolve(response)
            })
        })

    },
    getPostDetails: (postId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.POST_COLLECTION).findOne({ _id: objectId(postId) }).then((post) => {
                resolve(post)
            })
        })

    },

    updatePost: (postId, postDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.POST_COLLECTION)
                .updateOne({ _id: objectId(postId) }, {
                    $set: {
                        title: postDetails.title,
                        
                    }
                }).then((response) => {
                    resolve()
                })
        })
    },
   

    

}