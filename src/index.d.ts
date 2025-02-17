import orm, { EntitySchema as Table, ObjectLiteral } from "typeorm";
import { InsertResult } from "./types";

export { Table, orm };

type DataBaseConfig = {
    type: orm.DatabaseType;
    host: string;
    port?: number;
    user: string;
    password?: string;
    database: string;
    tables: Table[];
    /**
     * @description If true, synchronize database tables with entities on connection.
     */
    synchronize?: boolean;
};

type DBEvents = "connect" | "disconnect";

export class DataBase {
    static get all(): DataBase[];
    static getByKey(name: string): DataBase;

    /**
     * @description Create a new instance of DataBase.
     * @param {orm.DatabaseType} config.type The database type.
     * @param {string} config.host The database host.
     * @param {number} config.port The database port.
     * @param {string} config.user The database user.
     * @param {string} config.password The database password.
     * @param {string} config.database The database name.
     * @param {Table[]} config.tables The database tables.
     * @param {boolean} config.synchronize If true, synchronize database tables with entities on connection.
     *
     * @example
     * const db = new DataBase({
     *     type: "mysql",
     *     host: "localhost",
     *     port: 3306,
     *     user: "root",
     *     password: "myPassword",
     *     database: "my_db",
     * })
     */
    constructor(config: DataBaseConfig);

    get key(): string;
    get name(): string;
    get host(): string;
    get port(): number;
    get user(): string;
    get dataSource(): orm.DataSource;

    /**
     * @description Check if database connection is established.
     * @returns {boolean}
     */
    get isConnected(): boolean;

    /**
     * @description Connect to database.
     * @returns {Promise<void>}
     * @throws {Error}
     */
    connect(): Promise<void>;

    /**
     * @description Disconnect from database.
     * @returns {Promise<void>}
     * @throws {Error}
     */
    disconnect(): Promise<void>;

    /**
     * @description Check if database connection is established.
     * @returns {Promise<boolean>}
     */
    checkConnection(): Promise<boolean>;

    on(event: DBEvents, listener: () => void): void;
    once(event: DBEvents, listener: () => void): void;
    off(event: DBEvents, listener: () => void): void;

    /**
     * @description Get repository by name.
     * @param {string} repoName The repository name.
     */
    getRepository(repoName: string): orm.Repository<orm.ObjectLiteral>;

    /**
     * @description Fetch paginated documents by field value.
     * @param {string} repoName The reponame where to look.
     * @param {orm.FindManyOptions<orm.ObjectLiteral>} query The query to search for.
     */
    find(repoName: string, query: orm.FindManyOptions<orm.ObjectLiteral>): Promise<orm.ObjectLiteral[]>;

    /**
     * @description Fetch one document by field value.
     * @param {string} repoName The reponame where to look.
     * @param {orm.FindOneOptions<orm.ObjectLiteral>} query The query to search for.
     */
    findOne(repoName: string, query: orm.FindOneOptions<orm.ObjectLiteral>): Promise<orm.ObjectLiteral | null>;

    /**
     * @description Insert a new document.
     * @param {string} repoName The reponame where to insert.
     * @param {orm.ObjectLiteral} query The query to insert.
     */
    //  insert(repoName: string, query: ObjectLiteral): Promise<orm.InsertResult>;
    insert(repoName: string, query: ObjectLiteral): Promise<InsertResult>;

    /**
     * @description Update a document by field value.
     * @param {string} repoName The reponame where to update.
     * @param {orm.FindOptionsWhere<orm.ObjectLiteral>} query The query to search for.
     * @param {orm.ObjectLiteral} data The data to update.
     */
    update(repoName: string, query: orm.FindOptionsWhere<orm.ObjectLiteral>, data: orm.ObjectLiteral): Promise<orm.UpdateResult>;

    /**
     * @description Delete a document by field value.
     * @param {string} repoName The reponame where to delete.
     * @param {orm.FindOptionsWhere<orm.ObjectLiteral>} query The query to search for.
     */
    delete(repoName: string, query: orm.FindOptionsWhere<orm.ObjectLiteral>): Promise<orm.DeleteResult>;

    /**
     * @description Count documents by field value.
     * @param {string} repoName The reponame where to count.
     * @param {orm.FindManyOptions<orm.ObjectLiteral>} query The query to search for.
     */
    count(repoName: string, query: orm.FindManyOptions<orm.ObjectLiteral>): Promise<number>;

    /**
     * @description Increment a field value.
     * @param {string} repoName The reponame where to increment.
     * @param {string} field The field to increment.
     * @param {orm.FindOptionsWhere<orm.ObjectLiteral>} query The query to search for.
     * @param {number} value The value to increment.
     */
    increment(repoName: string, field: string, query?: orm.FindOptionsWhere<orm.ObjectLiteral>, value?: number): Promise<orm.UpdateResult>;

    /**
     * @description Decrement a field value.
     * @param {string} repoName The reponame where to decrement.
     * @param {string} field The field to decrement.
     * @param {orm.FindOptionsWhere<orm.ObjectLiteral>} query The query to search for.
     * @param {number} value The value to decrement.
     */
    decrement(repoName: string, field: string, query?: orm.FindOptionsWhere<orm.ObjectLiteral>, value?: number): Promise<orm.UpdateResult>;
}
