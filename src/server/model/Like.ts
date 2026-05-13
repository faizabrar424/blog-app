import { ObjectId } from "mongodb";
import { IMongoloquentSchema, IMongoloquentTimestamps, Model } from "mongoloquent";
import User, { IUser } from "./User";

export interface ILike extends IMongoloquentSchema, IMongoloquentTimestamps {
  postId: ObjectId;
  userId: ObjectId;
  user?: IUser;
}

export default class Like extends Model<ILike> {
  static $schema: ILike;
  protected $collection: string = "likes";

  user() {
    return this.belongsTo(User, "userId", "_id");
  }
}
