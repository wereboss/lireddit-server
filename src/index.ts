import 'reflect-metadata';
import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/Post";

const main = async () => {
    const orm = await MikroORM.init(mikroOrmConfig);

    // const post = orm.em.create(Post,{title:'My First Post in React'});
    await orm.getMigrator().up();
    // console.log('------sql-----');
    // await orm.em.persistAndFlush(post);
    // console.log('------sql2-----');
    // await orm.em.nativeInsert(Post,{title:'My Native post'});
    const posts = await orm.em.find(Post,{});
    console.log(posts);


    const app = express();
    // app.get("/",(_,res) => {
    //     res.send("Hello Express!!");
    // });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers:[HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({em: orm.em})
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000,() => {
        console.log("Express started on localhost:4000");
    });
}
 
main().catch((err) => {
    console.error(err);
});
