import csv from 'csv-parser';
import { Readable, Stream } from 'stream';

export const buildResponse = (statusCode: number, body: any) => ({
  statusCode: statusCode,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
  },
  body: JSON.stringify(body),
});

export const streamToString = (stream: Stream) =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });

export const readCSVFile = (data: Readable) =>
  new Promise<unknown[]>((res, rej) => {
    const results: unknown[] = [];
    try {
      data
        .pipe(csv())
        .on('data', (data: unknown) => {
          results.push(data);
        })
        .on('end', () => {
          res(results);
        });
    } catch (err) {
      rej(err);
    }
  });
