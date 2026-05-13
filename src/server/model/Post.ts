import { ObjectId } from "mongodb";
import { IMongoloquentSchema, IMongoloquentTimestamps, Model } from "mongoloquent";
import z from "zod";
import User, { IUser } from "./User";
import Comment, { IComment } from "./Comment";
import Like, { ILike } from "./Like";

export interface IPost extends IMongoloquentSchema, IMongoloquentTimestamps {
  title: string;
  content: string;
  tags: string[];
  userId: ObjectId;
  user?: IUser;
  comments?: IComment[];
  likes?: ILike[]
}

export const postSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
});

export default class Post extends Model<IPost> {
  public static $schema: IPost;
  protected $collection: string = "posts";

  // method relasi
  user() {
    return this.belongsTo(User, "userId", "_id");
  }

  comments() {
    return this.hasMany(Comment, "postId", "_id");
  }

  likes() {
    return this.hasMany(Like, "postId", "_id")
  }
}
