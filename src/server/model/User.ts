import { IMongoloquentSchema, IMongoloquentTimestamps, Model } from 'mongoloquent';
import { z } from "zod";

export interface IUser extends IMongoloquentSchema, IMongoloquentTimestamps {
    name: string
    email: string
    password: string
}

export const userSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(5)
})

export default class User extends Model<IUser> {
    static $schema: IUser
    protected $collection: string = "users"
}
