import { databaseModel, serverModel, userModel } from "./models";

const schema = {
  users: userModel,
  servers: serverModel,
  database: databaseModel,
};

export default schema;
