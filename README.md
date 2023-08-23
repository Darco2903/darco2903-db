# database-module

## DataBase Node.js module

## Information

This module uses [TypeORM](https://typeorm.io/) to ensure the connection to the database.

The Table class is a wrapper of the TypeORM [EntitySchema](https://typeorm.io/usage-with-javascript#entitycategoryjs) class.

## Installation

1. Install the module:

```bash
npm install darco2903-db
```

---

## Configuration

1. Create a `config.json` file that contains the following information:

```json
{
    "type": "DB_TYPE",
    "host": "HOST_NAME",
    "port": "PORT_NUMBER", // optional (default: 3306)
    "user": "DB_USERNAME",
    "password": "DB_PASSWORD", // optional
    "database": "DB_NAME",
    "synchronize": true|false // optional (default: false) - synchronize tables with database on connection
}
```

2. Create a `tables.js` file from the example below:

```js
const { Table } = require("darco2903-db");

const sampleTable = Table({
    name: "sample_table",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },
        name: {
            type: "varchar",
            length: 32,
            nullable: true,
            ...
        },
        ...
    },
});

module.exports = {
    sampleTable,
    ...
};
```

---

## Usage

```js
const { DataBase } = require("darco2903-db");
const { type, host, port, user, password, database, synchronize } = require("./config.json");
const tables = require("./tables.js");

const db = new DataBase({ type, host, port, user, password, database, tables, synchronize });

db.connect()
    .then(() => {
        console.log("Connected to database !");
    })
    .catch((error) => {
        console.log(error);
    });
```

---

## Methods

| Method                | Description                                      |
| --------------------- | ------------------------------------------------ |
| on                    | Listen to event                                  |
| once                  | Listen to event once                             |
| off                   | Stop listening to event                          |
| connect               | Init connection                                  |
| disconnect            | Close connection                                 |
| insertData            | Insert document into table                       |
| insertDatas           | Insert multiple documents into table             |
| updateDataByIds       | Update document(s) by id(s)                      |
| deleteByIds           | Delete document(s) by id(s)                      |
| fetchById             | Fetch document by id                             |
| fetchByIds            | Fetch multiple documents by ids                  |
| fetchAllRepo          | Fetch all documents by repository name           |
| fetchAllByFields      | Fetch document fields                            |
| fetchByValue          | Fetch documents by value                         |
| countByValue          | Count documents by value                         |
| countAllRepo          | Count all documents by repository name           |
| fetchByValuePaginated | Fetch documents by value paginated               |
| fetchAllRepoPaginated | Fetch all documents by repository name paginated |

## Attributes

| Attribute              | Description                        |
| ---------------------- | ---------------------------------- |
| isConnected            | Connection status                  |
| host                   | Host name                          |
| port                   | Port number                        |
| user                   | User name                          |
| database               | Database name                      |
| name                   | Database key name                  |
| **_static_** instances | Object with all DataBase instances |

## Events

| Event      | Description                |
| ---------- | -------------------------- |
| connect    | Connected to database      |
| disconnect | Disconnected from database |
