import User from "@/server/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import * as jose from "jose";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      const error = validation.error.issues[0];
      return NextResponse.json({ message: `${String(error.path[0])} - ${error.message}` }, { status: 400 });
    }

    const user = await User.where("email", body.email).first();
    if (!user) return NextResponse.json({ message: "Invalid email/password" }, { status: 401 });

    // const password = bcrypt.compareSync(body.password, user.password);
    const password = await bcrypt.compare(body.password, user.password);
    if (!password) return NextResponse.json({ message: "Invalid email/password" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const token = await new jose.SignJWT({ _id: user._id.toString(), name: user.name })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      //   .setExpirationTime("1h")
      .sign(secret);

    return NextResponse.json({ token, _id: user._id }, { status: 200 });
  } catch (err) {
    console.log(err, "<<<<<<<<<<<");
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
