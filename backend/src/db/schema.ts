import {
  backupModel,
  backupRelations,
  databaseModel,
  databaseRelations,
  serverModel,
  serverRelations,
  userModel,
} from "./models";

const schema = {
  users: userModel,
  servers: serverModel,
  database: databaseModel,
  backup: backupModel,

  serverRelations,
  databaseRelations,
  backupRelations,
};

export default schema;
