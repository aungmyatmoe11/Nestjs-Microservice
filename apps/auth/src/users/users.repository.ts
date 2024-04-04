import { AbstractRepository } from "@app/common";
import { Logger } from "@nestjs/common";
import { User } from "./schemas/user.schema";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model, connection } from "mongoose";

export class UsersRepository extends AbstractRepository<User>{
    protected readonly logger = new Logger(UsersRepository.name);

    constructor(
        @InjectModel(User.name) userModel: Model<User>,
        @InjectConnection() connection: Connection
    ) {
        super(userModel, connection); // ? repository thone yim model yl connection yl chate ya tl database nk so yim
    }
}