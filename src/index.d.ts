declare module "darco2903-db" {
    import orm from "typeorm";

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

    declare class Table extends orm.EntitySchema {}

    declare class DataBase {
        /**
         * @description Create a new instance of DataBase.
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
        constructor(config: DataBaseConfig): DataBase;

        on(event: "connect", listener: () => void): void;
        once(event: "connect", listener: () => void): void;
        off(event: "connect", listener: () => void): void;

        on(event: "disconnect", listener: () => void): void;
        once(event: "disconnect", listener: () => void): void;
        off(event: "disconnect", listener: () => void): void;

        static get instances(): { [x: string]: DataBase };

        get name(): string;
        get host(): string;
        get port(): number;
        get user(): string;
        get database(): string;

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
         * @description Insert document into table.
         * @param {Object} data Document pulled down from table.
         * @param {string} repoName The name of the table.
         * @returns {Promise<Number>} Returns inserted document id.
         * @throws {Error}
         */
        insertData(data: Object, repoName: string): Promise<number>;

        /**
         * @description Insert multiple documents into table.
         * @param {Object[]} datas Documents pulled down from table.
         * @param {string} repoName The name of the table.
         * @returns {Promise<Number[]>} Returns inserted document ids.
         * @throws {Error}
         */
        insertDatas(datas: Object[], repoName: string): Promise<number[]>;

        /**
         * @description Update document by id(s).
         * @param {Number|Number[]} ids Can be array or single id.
         * @param {Object} data Data to update document(s) with.
         * @param {string} repoName The name of the table.
         * @returns {Promise<Number>} Returns the number of documents updated.
         * @throws {Error}
         */
        updateDataByIds(ids: number | number[], data: Object, repoName: string): Promise<number>;

        /**
         * @description Delete document by id(s).
         * @param {Number|Number[]} ids Can be array or single id.
         * @param {string} repoName The name of the table.
         * @returns {Promise<Number>} Returns the number of documents deleted.
         * @throws {Error}
         */
        deleteByIds(ids: number | number[], repoName: string): Promise<number>;

        /**
         * @description Fetch documents by id.
         * @param {Number} id The id of the document.
         * @param {string} repoName The name of the table.
         * @returns {Promise<orm.ObjectLiteral|undefined>} Returns document or undefined if not found.
         * @throws {Error}
         */
        fetchById(id: number, repoName: string): Promise<orm.ObjectLiteral | undefined>;

        /**
         * @description Fetch documents by ids.
         * @param {Number[]} ids Array of ids.
         * @param {string} repoName The name of the table.
         * @returns {Promise<orm.ObjectLiteral[]|undefined>} Returns documents or undefined if no documents found.
         * @throws {Error}
         */
        fetchByIds(ids: number[], repoName: string): Promise<orm.ObjectLiteral[] | undefined>;

        /**
         * @description Fetch all documents by repository name.
         * @param {string} repoName The name of the table.
         * @returns {Promise<orm.ObjectLiteral[]|undefined>} Returns an array of document or undefined if no documents found.
         * @throws {Error}
         */
        fetchAllRepo(repoName: string): Promise<orm.ObjectLiteral[] | undefined>;

        /**
         * @description Select fields from documents by field names.
         * @param {string|string[]} fieldNames
         * @param {string} repoName
         * @returns {Promise<orm.ObjectLiteral[]|undefined>} Returns an array of Objects or undefined if no documents found.
         * @throws {Error}
         */
        fetchAllByFields(fieldNames: string | string[], repoName: string): Promise<orm.ObjectLiteral[] | undefined>;

        /**
         * @description Fetch all documents by field value.
         * @param {string} fieldName The name of the field.
         * @param {any} fieldValue The value of that field.
         * @param {string} repoName The reponame where to look.
         * @returns {Promise<orm.ObjectLiteral[]>} Returns an array of Objects.
         * @throws {Error}
         */
        fetchByValue(fieldName: string, fieldValue: any, repoName: string): Promise<orm.ObjectLiteral[]>;

        /**
         * @description Count documents by field value.
         * @param {string} fieldName The name of the field.
         * @param {any} fieldValue The value of that field.
         * @param {string} repoName The reponame where to look.
         * @returns {Promise<Number>} Returns the number of documents found.
         * @throws {Error}
         */
        countByValue(fieldName: string, fieldValue: any, repoName: string): Promise<number>;

        /**
         * @description Get number of documents in table.
         * @param {string} repoName The name of the table.
         * @returns {Promise<Number>} Returns the number of documents in table.
         * @throws {Error}
         */
        countAllRepo(repoName: string): Promise<number>;
    }
}
