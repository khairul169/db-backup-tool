import db from ".";
import { userModel } from "./models";

export const seed = async () => {
  await db
    .insert(userModel)
    .values({
      username: "admin",
      password: await Bun.password.hash("admin", { algorithm: "bcrypt" }),
    })
    .execute();
};
