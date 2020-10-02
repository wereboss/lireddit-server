import {
    Field,
    InputType
} from "type-graphql";


@InputType()
export class UserPwdInput {
    @Field()
    username: string;
    @Field()
    email: string;
    @Field()
    password: string;
}
