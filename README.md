# database-module

**DataBase Node.js module**

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

## Usage

```js
const DataBase = require("./DataBase");
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
