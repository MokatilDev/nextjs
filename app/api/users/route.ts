import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {

    const prisma = new PrismaClient()
    const slatRounds = 10;

    const body = await req.json();
    const { email, password, username, bio } = body;

    const salt = await bcrypt.genSalt(slatRounds);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
        data: {
            email,
            password: hashPassword,
            username,
            bio
        }
    });

    return NextResponse.json({ message: "User has been created", user })
}