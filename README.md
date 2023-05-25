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

1. Create a `config.json` file that contains the following information:

```json
{
    "type": "DB_TYPE",
    "host": "HOST_NAME",
    "port": "PORT_NUMBER",
    "user": "DB_USERNAME",
    "password": "DB_PASSWORD",
    "database": "DB_NAME",
    "syncronize": "true/false" // syncronize tables with database
}
```

2. Create a `entities.js` file from the example below:

```js
const {Entity} = require("darco2903-db");

const sampleTable = Entity({
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
const tables = require("./tables.js");
const { type, host, port, user, password, database } = require("./config.json");

const db = new DataBase({ type, host, port, user, password, database, tables, syncronize });

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

| Method           | Description                            |
| ---------------- | -------------------------------------- |
| connect          | Init connection                        |
| disconnect       | Close connection                       |
| insertData       | Insert document into table             |
| insertDatas      | Insert multiple documents into table   |
| updateDataByIds  | Update document(s) by id(s)            |
| deleteByIds      | Delete document(s) by id(s)            |
| fetchById        | Fetch document by id                   |
| fetchByIds       | Fetch multiple documents by ids        |
| fetchAllRepo     | Fetch all documents by repository name |
| fetchAllByFields | Fetch document fields                  |
| fetchByValue     | Fetch documents by value               |

## Attributes

| Attribute   | Description       |
| ----------- | ----------------- |
| isConnected | Connection status |
| host        | Host name         |
| port        | Port number       |
| user        | User name         |
| database    | Database name     |
