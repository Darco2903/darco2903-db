type OkPacket = {
    fieldCount: number;
    affectedRows: number;
    insertId: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
};

export type InsertResult = {
    identifiers: { id: number }[];
    generatedMaps: { id: number }[];
    raw: OkPacket;
};
