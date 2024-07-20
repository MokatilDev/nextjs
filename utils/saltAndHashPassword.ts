import bcrypt from "bcryptjs";

const slatRounds = 10;

export const saltAndHashPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(slatRounds);

    return bcrypt.hashSync(password, salt);
}