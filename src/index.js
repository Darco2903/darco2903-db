const orm = require("typeorm");
const EventEmitter = require("events");

class DataBase {
    /** @type {Map<string, DataBase>} */
    static #instances = new Map();
    static get all() {
        return Array.from(DataBase.#instances.values());
    }

    static getByKey(key) {
        return DataBase.#instances.get(key);
    }

    /** @type {orm.DataSource} */
    #dataSource;
    get dataSource() {
        return this.#dataSource;
    }

    /** @type {EventEmitter} */
    #eventEmitter;

    /** @type {boolean} */
    #initConn;

    /** @type {string} */
    #key;
    get key() {
        return this.#key;
    }

    constructor({ type, host, port = 3306, user, password = "", database, tables, synchronize = false }) {
        if (!type) throw new Error("Database type is required");
        if (!host) throw new Error("Database host is required");
        if (!user) throw new Error("Database user is required");
        if (!database) throw new Error("Database name is required");
        if (!tables) throw new Error("Database tables are required");

        this.#key = `${host}:${port}/${database}`;

        if (DataBase.#instances.has(this.#key)) {
            return DataBase.#instances.get(this.#key);
        }

        this.#initConn = false;
        this.#eventEmitter = new EventEmitter();
        this.#dataSource = new orm.DataSource({
            type,
            host: host === "localhost" ? "127.0.0.1" : host,
            port,
            username: user,
            password,
            database,
            entities: tables,
            synchronize: typeof synchronize === "string" ? synchronize === "true" : synchronize,
            cache: true,
        });
        DataBase.#instances.set(this.#key, this);
    }

    get name() {
        return this.#dataSource.options.database;
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

    get isConnected() {
        return this.#dataSource.isInitialized;
    }

    async connect() {
        if (this.isConnected || this.#initConn) {
            throw new Error("Already connected to database");
        }
        this.#initConn = true;
        return this.#dataSource
            .initialize()
            .then(() => this.#eventEmitter.emit("connect"))
            .finally(() => (this.#initConn = false));
    }

    async disconnect() {
        if (!this.#dataSource.isInitialized) {
            throw new Error("Not connected to database");
        }
        return this.#dataSource.destroy().then(() => {
            this.#eventEmitter.emit("disconnect");
        });
    }

    async checkConnection() {
        let ok = this.isConnected;
        if (ok) {
            ok = await this.dataSource
                .query("SELECT VERSION()")
                .then(() => true)
                .catch(async (err) => {
                    await this.disconnect();
                });
        }

        if (!ok) {
            await this.connect().catch((err) => {});
        }
        return this.isConnected;
    }

    on(event, listener) {
        this.#eventEmitter.on(event, listener);
    }

    once(event, listener) {
        this.#eventEmitter.once(event, listener);
    }

    off(event, listener) {
        this.#eventEmitter.off(event, listener);
    }

    #checkConnection() {
        if (!this.isConnected) {
            throw new Error("Not connected to database");
        } else if (this.#initConn) {
            throw new Error("Database is initializing");
        }
    }

    async #catchConnectionError(err) {
        // console.log("code", err.code);
        if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
            await this.disconnect();
            // throw new Error("Database connection error");
        }
        throw err;
    }

    getRepository(repoName) {
        return this.#dataSource.getRepository(repoName);
    }

    async find(repoName, query = {}) {
        this.#checkConnection();
        return this.getRepository(repoName).find(query).catch(this.#catchConnectionError.bind(this));
    }

    async findOne(repoName, query = {}) {
        this.#checkConnection();
        return this.getRepository(repoName).findOne(query).catch(this.#catchConnectionError.bind(this));
    }

    async insert(repoName, data) {
        this.#checkConnection();
        return this.getRepository(repoName).insert(data).catch(this.#catchConnectionError.bind(this));
    }

    async update(repoName, query = {}, data) {
        this.#checkConnection();
        return this.getRepository(repoName).update(query, data).catch(this.#catchConnectionError.bind(this));
    }

    async delete(repoName, query = {}) {
        this.#checkConnection();
        return this.getRepository(repoName).delete(query).catch(this.#catchConnectionError.bind(this));
    }

    async count(repoName, query = {}) {
        this.#checkConnection();
        return this.getRepository(repoName).count(query).catch(this.#catchConnectionError.bind(this));
    }

    async increment(repoName, field, query = {}, value = 1) {
        this.#checkConnection();
        return this.getRepository(repoName).increment(query, field, value).catch(this.#catchConnectionError.bind(this));
    }

    async decrement(repoName, field, query = {}, value = 1) {
        this.#checkConnection();
        return this.getRepository(repoName).decrement(query, field, value).catch(this.#catchConnectionError.bind(this));
    }
}

module.exports = {
    DataBase,
    Table: orm.EntitySchema,
    orm,
};
