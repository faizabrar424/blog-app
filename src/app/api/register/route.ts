import User, { userSchema } from "@/server/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = userSchema.safeParse(body);
    if (!validation.success) {
      // console.log(validation.error, validation.data, "<<<<<<");

      const error = validation.error.issues[0];
      return NextResponse.json({ message: `${String(error.path[0])} - ${error.message}` }, { status: 400 });
    }

    // CEK DUPLICATE EMAIL
    const user = await User.where("email", body.email).first();
    if (user) return NextResponse.json({ message: "email sudah terdaftar" }, { status: 400 });

    // HASH PASSWORD
    body.password = bcrypt.hashSync(body.password, 10);

    // INSERT DATA KE DB
    await User.insert(body);

    return NextResponse.json({ message: "Register berhasil" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "internal server error" }, { status: 500 });
  }
}
