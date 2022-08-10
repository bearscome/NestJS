import { TypeOrmModuleOptions } from "@nestjs/typeorm";

function ormConfig():TypeOrmModuleOptions{
    const commonConf = {
        SYNCRONIZE: false,
        ENTITIES: [__dirname + '/domain/*.entity{.ts,.js}'],
        MIGRATIONS: [__dirname + '/migrations/**/*{.ts,.js}'],
        CLI: {
            migrationsDir: 'src/migrations',
        },
        MIGRATIONS_RUN: false,
    };

    const ormconfig: TypeOrmModuleOptions = {
        name: 'default',
        type: 'mysql',
        database: 'test',
        host: "login-lecture.ci1vjtewuuio.ap-northeast-2.rds.amazonaws.com",
        port: 3306,
        username: "admin",
        password: "qwe123qwe",
        logging: true,
        synchronize: commonConf.SYNCRONIZE,
        entities: commonConf.ENTITIES,
        migrations: commonConf.MIGRATIONS,
        // cli: commonConf.CLI,
        migrationsRun: commonConf.MIGRATIONS_RUN,
    };
    

    return ormconfig
}

export {ormConfig}