# database-module

## DataBase Node.js module

---

## Installation

1. Install the module:

```bash
npm install darco2903-db
```

---

## Configuration

1. Create a `config.json` file in the root directory of your project that contains the following information:

```json
{
    "type": "DB_TYPE",
    "host": "HOST_NAME",
    "port": "PORT_NUMBER",
    "username": "DB_USERNAME",
    "password": "DB_PASSWORD",
    "database": "DB_NAME"
}
```

2. Create a `entities.js` file from the example below:

```js
const orm = require("typeorm");

const templateTable = orm.EntitySchema({
    name: "template_table",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "text",
            nullable: true,
        },
        ...
    },
});

module.exports = [templateTable, ...];
```

---

## Usage

```js
const DataBase = require("darco2903-db");
const entities = require("./entities");

const { type, host, port, username, password, database } = require("./config.json");

const db = new DataBase(type, host, port, username, password, database, entities);

db.connect()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((error) => {
        console.log(error);
    });

module.exports = db;
```

---

## Methods

| Method           | Description                                 |
| ---------------- | ------------------------------------------- |
| connect          | Init connection                             |
| disconnect       | Close connection                            |
| isConnected      | Check connection is established             |
| insertData       | Insert document into table                  |
| insertDatas      | Insert multiple documents into table        |
| updateDataByIds  | Update document by id(s)                    |
| deleteByIds      | Delete document by id(s)                    |
| fetchById        | Fetch document by id                        |
| fetchByIds       | Fetch documents by ids                      |
| fetchAllRepo     | Fetch all documents by repository name      |
| fetchAllByFields | Select fields from documents by field names |
| fetchAllByValue  | Fetch all documents by field value          |
