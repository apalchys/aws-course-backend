import { SQSClient } from "@aws-sdk/client-sqs"

export default new SQSClient({ region: process.env.IMPORT_AWS_REGION})
