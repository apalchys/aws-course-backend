import fs from "fs";
import csv from "csv-parser";

export const buildResponse = (statusCode, body) => ({
    statusCode: statusCode,
    headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
    },
    body: JSON.stringify(body),
})

export const streamToString = (stream) =>
    new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });

export const readCSVFile = (data) => new Promise((res, rej) => {
    const results = []
    try {
        data
            .pipe(csv())
            .on('data', (data) => {
                console.log(data)
                results.push(data)
            })
            .on('end', () => {
                res(results)
            })
    } catch (err) {
        rej(err)
    }
})
