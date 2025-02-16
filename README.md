# Darco2903 Database Module

## Information

This module uses [TypeORM](https://typeorm.io/) to ensure the connection to the database.

The Table class is a wrapper of the TypeORM [EntitySchema](https://typeorm.io/usage-with-javascript#entitycategoryjs) class.

## Installation

```bash
npm install darco2903-db
```

---

## Configuration

Create a `config.json` file that contains the following information:

```json
{
    "type": "DB_TYPE",
    "host": "HOST_NAME",
    "port": PORT_NUMBER, // optional (default: 3306)
    "user": "DB_USERNAME",
    "password": "DB_PASSWORD", // optional
    "database": "DB_NAME",
    "synchronize": true|false // optional (default: false) - synchronize tables with database on connection
}
```

## Usage

```js
const { DataBase, Table } = require("darco2903-db");
const { type, host, port, user, password, database, synchronize } = require("./config.json");

const tables = [
    new Table({
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
    }),
];

const db = new DataBase({ type, host, port, user, password, database, tables, synchronize });

(async()=>{
    await db.connect();

    const rows = await db.find("sample_table", {
        select: ["id", "name"],
        where: {
            name: "sample",
        },
        ...
    });

    console.log(rows); // [{ id: 1, name: "sample" }, ...]

    await db.disconnect();
})();
```

---

## Methods

| Method              | Description                  |
| ------------------- | ---------------------------- |
| **static** getByKey | Get DataBase instance by key |
| on                  | Listen to event              |
| once                | Listen to event once         |
| off                 | Stop listening to event      |
| connect             | Init connection              |
| disconnect          | Close connection             |
| checkConnection     | Check connection status      |
| getRepository       | Get repository of a table    |
| find                | Find all rows in a table     |
| findOne             | Find one row in a table      |
| insert              | Insert a row in a table      |
| update              | Update a row in a table      |
| delete              | Delete a row in a table      |
| count               | Count rows in a table        |

## Attributes

| Attribute      | Description                    |
| -------------- | ------------------------------ |
| **static** all | List of all DataBase instances |
| isConnected    | Connection status              |
| dataSource     | Data source                    |
| key            | Database key                   |
| name           | Database name                  |
| host           | Host name                      |
| port           | Port number                    |
| user           | User name                      |

## Events

| Event      | Description                |
| ---------- | -------------------------- |
| connect    | Connected to database      |
| disconnect | Disconnected from database |
