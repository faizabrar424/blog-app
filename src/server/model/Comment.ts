import { ObjectId } from "mongodb";
import { IMongoloquentSchema, IMongoloquentTimestamps, Model } from "mongoloquent";
import z from "zod";
import User, { IUser } from "./User";


export interface IComment extends IMongoloquentSchema, IMongoloquentTimestamps {
  comment: string;
  postId: ObjectId;
  userId: ObjectId;
  user?: IUser
}

export const commentSchema = z.object({
  comment: z.string().min(1),
});

export default class Comment extends Model<IComment> {
  static $schema: IComment;
  protected $collection: string = "comments";

  user() {
    return this.belongsTo(User, "userId", "_id")
  }
}
