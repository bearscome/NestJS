import { TypeOrmModuleOptions } from "@nestjs/typeorm";

function ormConfig(): TypeOrmModuleOptions {
  const commonConf = {
    SYNCRONIZE: true,
    ENTITIES: [__dirname + "/domain/*.entity{.ts,.js}"],
    MIGRATIONS: [__dirname + "/migrations/**/*{.ts,.js}"],
    CLI: {
      migrationsDir: "src/migrations",
    },
    MIGRATIONS_RUN: false,
  };

  const ormconfig: TypeOrmModuleOptions = {
    name: "default",
    type: "mysql",
    database: process.env.DATABASE,
    host: process.env.DATABASHOST,
    port: Number(process.env.DATABASEPORT),
    username: process.env.DATABASEUSERNAME,
    password: process.env.DATABASEPASSWORD,
    logging: true,
    synchronize: commonConf.SYNCRONIZE,
    entities: commonConf.ENTITIES,
    migrations: commonConf.MIGRATIONS,
    // cli: commonConf.CLI,
    migrationsRun: commonConf.MIGRATIONS_RUN,
    timezone: "local",
  };

  return ormconfig;
}

export { ormConfig };
