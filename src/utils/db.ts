import mongoose from "mongoose";

export const connectToDb = async () => {
  return mongoose
    .connect(process.env.DB_CONNECT || "")
    .then(() => console.log("Connected to DB"))
    .catch((err: any) => console.log(err));
};
