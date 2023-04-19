export = DataBase;
declare class DataBase {
    constructor(type: any, host: any, port: any, username: any, password: any, database: any, entities: any);
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
     * @returns {boolean}
     */
    isConnected(): boolean;
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
    selectByValue(fieldName: string, fieldValue: any, repoName: string): Promise<orm.ObjectLiteral[]>;
    #private;
}
import orm = require("typeorm");