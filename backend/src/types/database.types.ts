export type DatabaseConfig = PostgresConfig;

export type PostgresConfig = {
  type: "postgres";
  host: string;
  user: string;
  pass?: string;
  port?: number;
};

export type DatabaseListItem = {
  name: string;
  size: string;
};

export type DumpOptions = Partial<{
  compress: boolean;
}>;
