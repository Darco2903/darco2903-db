const orm = require("typeorm");

class DataBase {
    /**
     * @description Create a database instance.
     * @param {orm.DatabaseType} type
     * @param {string} host
     * @param {Number} port
     * @param {string} username
     * @param {string} password
     * @param {string} database
     * @param {orm.EntitySchema[]} entities
     * @returns {DataBase}
     */

    #connected;
    #initConn;
    #dataSource;

    constructor(type, host, port, username, password, database, entities) {
        this.#connected = false;
        this.#initConn = false;
        this.#dataSource = new orm.DataSource({
            type,
            host,
            port,
            username,
            password,
            database,
            entities,
            cache: true,
        });
    }

    /**
     * @description Connect to database.
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async connect() {
        try {
            if (this.#connected || this.#initConn) {
                throw new Error("Already connected to database");
            }
            this.#initConn = true;
            await this.#dataSource.initialize();
            await this.#dataSource.synchronize();
            this.#connected = true;
            return Promise.resolve();
        } catch (error) {
            this.#initConn = false;
            return Promise.reject(error);
        }
    }

    /**
     * @description Disconnect from database.
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async disconnect() {
        try {
            if (!this.#connected) {
                throw new Error("Not connected to database");
            }
            await this.#dataSource.destroy();
            this.#connected = false;
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Check if database connection is established.
     * @returns {boolean}
     */
    isConnected() {
        return this.#connected;
    }

    /**
     * @description Insert document into table.
     * @param {Object} data Document pulled down from table.
     * @param {string} repoName The name of the table.
     * @returns {Promise<Number>} Returns inserted document id.
     * @throws {Error}
     */
    async insertData(data, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            const res = await repo.insert(data);
            const id = res.identifiers[0]?.id;
            return Promise.resolve(id);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Insert multiple documents into table.
     * @param {Object[]} datas Documents pulled down from table.
     * @param {string} repoName The name of the table.
     * @returns {Promise<Number[]>} Returns inserted document ids.
     * @throws {Error}
     */
    async insertDatas(datas, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            const res = await repo.insert(datas);
            let ids = res.identifiers.map((doc) => doc.id);
            if (ids.length === 0) {
                ids = null;
            }
            return Promise.resolve(ids);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Update document by id(s).
     * @param {Number|Number[]} ids Can be array or single id.
     * @param {Object} data Data to update document(s) with.
     * @param {string} repoName The name of the table.
     * @returns {Promise<Number>} Returns the number of documents updated.
     * @throws {Error}
     */
    async updateDataByIds(ids, data, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            const res = await repo.update(ids, data);
            return Promise.resolve(res.affected);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Delete document by id(s).
     * @param {Number|Number[]} ids Can be array or single id.
     * @param {string} repoName The name of the table.
     * @returns {Promise<Number>} Returns the number of documents deleted.
     * @throws {Error}
     */
    async deleteByIds(ids, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            if (!Array.isArray(ids)) {
                ids = [ids];
            }
            const res = await repo.delete(ids);
            return Promise.resolve(res.affected);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Fetch documents by id.
     * @param {Number} id The id of the document.
     * @param {string} repoName The name of the table.
     * @returns {Promise<orm.ObjectLiteral|undefined>} Returns document or undefined if not found.
     * @throws {Error}
     */
    async fetchById(id, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            let res = await repo.findBy({ id: orm.Equal(id) });
            if (res.length > 0) {
                res = res[0];
            } else {
                res = null;
            }
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Fetch documents by ids.
     * @param {Number[]} ids Array of ids.
     * @param {string} repoName The name of the table.
     * @returns {Promise<orm.ObjectLiteral[]|undefined>} Returns documents or undefined if no documents found.
     * @throws {Error}
     */
    async fetchByIds(ids, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            let res = await repo.findBy({ id: orm.In(ids) });
            if (res.length === 0) {
                res = null;
            }
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Fetch all documents by repository name.
     * @param {string} repoName The name of the table.
     * @returns {Promise<orm.ObjectLiteral[]|undefined>} Returns an array of document or undefined if no documents found.
     * @throws {Error}
     */
    async fetchAllRepo(repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            let res = await repo.find();
            if (res.length <= 0) {
                res = null;
            }
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Select fields from documents by field names.
     * @param {string|string[]} fieldNames
     * @param {string} repoName
     * @returns {Promise<orm.ObjectLiteral[]|undefined>} Returns an array of Objects or undefined if no documents found.
     * @throws {Error}
     */
    async fetchAllByFields(fieldNames, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            if (!Array.isArray(fieldNames)) {
                fieldNames = [fieldNames];
            }
            let fields = {};
            fieldNames.forEach((fieldName) => {
                fields[fieldName] = true;
            });
            let res = await repo.find({ select: fields });
            if (res.length <= 0) {
                res = null;
            }
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * @description Fetch all documents by field value.
     * @param {string} fieldName The name of the field.
     * @param {any} fieldValue The value of that field.
     * @param {string} repoName The reponame where to look.
     * @returns {Promise<orm.ObjectLiteral[]>} Returns an array of Objects.
     * @throws {Error}
     */
    async selectByValue(fieldName, fieldValue, repoName) {
        try {
            const repo = this.#dataSource.getRepository(repoName);
            let res = await repo.findBy({ [fieldName]: orm.Equal(fieldValue) });
            if (res.length <= 0) {
                res = null;
            }
            return Promise.resolve(res);
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

module.exports = DataBase;
