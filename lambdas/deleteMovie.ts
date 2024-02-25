import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = createDDbDocClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const movieId = event.pathParameters?.movieId;
  if (!movieId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing or invalid movieId" }),
    };
  }

  try {
    await ddbDocClient.send(
      new DeleteCommand({
        TableName: process.env.TABLE_NAME,
        Key: { id: movieId },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Movie deleted successfully" }),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

function createDDbDocClient() {
    const ddbClient = new DynamoDBClient({ region: process.env.REGION });
    const marshallOptions = {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true,
    };
    const unmarshallOptions = {
        wrapNumbers: false,
    };
    const translateConfig = { marshallOptions, unmarshallOptions };
    return DynamoDBDocumentClient.from(ddbClient, translateConfig);
}