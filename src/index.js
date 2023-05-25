const orm = require("typeorm");

class DataBase {
    /** @type {boolean} */
    #initConn;
    /** @type {boolean} */
    #syncronize;
    /** @type {orm.DataSource} */
    #dataSource;

    /**
     * @description Create a database instance.
     * @param {orm.DatabaseType} type
     * @param {string} host
     * @param {Number} [port]
     * @param {string} user
     * @param {string} [password]
     * @param {string} database
     * @param {orm.EntitySchema[]} tables
     * @param {boolean} [synchronize]
     * @returns {DataBase}
     */
    constructor({ type, host, port = 3306, user, password = "", database, tables, synchronize = false }) {
        if (!type) {
            throw new Error("Database type is required");
        } else if (!host) {
            throw new Error("Database host is required");
        } else if (!user) {
            throw new Error("Database user is required");
        } else if (!database) {
            throw new Error("Database name is required");
        } else if (!tables) {
            throw new Error("Database tables are required");
        }
        this.#initConn = false;
        this.#dataSource = new orm.DataSource({
            type,
            host: host === "localhost" ? "127.0.0.1" : host,
            port,
            username: user,
            password,
            database,
            entities: tables,
            synchronize,
            cache: true,
        });
    }

    get host() {
        return this.#dataSource.options.host;
    }

    get port() {
        return this.#dataSource.options.port;
    }

    get user() {
        return this.#dataSource.options.username;
    }

    get database() {
        return this.#dataSource.options.database;
    }

    get isConnected() {
        return this.#dataSource.isInitialized;
    }

    /**
     * @description Connect to database.
     * @returns {Promise<void>}
     * @throws {Error}
     */
    async connect() {
        try {
            if (this.#dataSource.isInitialized || this.#initConn) {
                throw new Error("Already connected to database");
            }
            this.#initConn = true;
            await this.#dataSource.initialize();
            if (this.#syncronize) {
                await this.#dataSource.synchronize();
            }
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
            if (!this.#dataSource.isInitialized) {
                throw new Error("Not connected to database");
            }
            await this.#dataSource.destroy();
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
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
    async fetchByValue(fieldName, fieldValue, repoName) {
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

module.exports = {
    DataBase,
    Entity: orm.EntitySchema,
};
