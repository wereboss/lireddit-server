import "reflect-metadata";
import { MikroORM } from "@mikro-orm/core";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/Post";
import { UserResolver } from "./resolvers/user";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { MyContext } from "./types";
import cors from 'cors';
// import { sendEmail } from "./utils/sendEmail";
// import { User } from "./entities/User";

const main = async () => {
    //sendEmail('sr1n4th5tudy@gmail.com','lireddit server Change Email test');    
  const orm = await MikroORM.init(mikroOrmConfig);
//   await orm.em.nativeDelete(User,{});
  // const post = orm.em.create(Post,{title:'My First Post in React'});
  await orm.getMigrator().up();
  // console.log('------sql-----');
  // await orm.em.persistAndFlush(post);
  // console.log('------sql2-----');
  // await orm.em.nativeInsert(Post,{title:'My Native post'});
  const posts = await orm.em.find(Post, {});
  console.log(posts);

  const app = express();
  // app.get("/",(_,res) => {
  //     res.send("Hello Express!!");
  // });

  const RedisStore = connectRedis(session);
  const redis = new Redis();

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 yrs
        httpOnly: true,
        secure: false,
        sameSite: "lax", //csrf
      },
      secret: "iyubjgkuyugjvjh",
      saveUninitialized: false,
      resave: false,
    })
  );
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => {
      return { em: orm.em, req, res, redis };
    },
  });

  apolloServer.applyMiddleware({
    app,
    cors:false
    // cors: { origin: "http://localhost:3000" },
    //this is before adding cors pkg
  });

  app.listen(4000, () => {
    console.log("Express started on localhost:4000");
  });
};

main().catch((err) => {
  console.error(err);
});
