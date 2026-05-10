import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";import Busboy from "busboy";

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." })
    };
  }

  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: event.headers });
    const files = [];
    const fields = {};

    bb.on("file", (name, file, info) => {
      const { filename, mimeType } = info;
      let fileBuffer = [];

      file.on("data", data => {
        fileBuffer.push(data);
      });

      file.on("end", () => {
        files.push({
          fieldName: name,
          filename,
          mimeType,
          size: Buffer.concat(fileBuffer).length
        });
      });
    });

    bb.on("field", (name, value) => {
      fields[name] = value;
    });

    bb.on("finish", () => {
      resolve({
        statusCode: 200,
        body: JSON.stringify({
          message: "upload-handler.js received your file(s)!",
          fields,
          files
        })
      });
    });

    bb.end(Buffer.from(event.body, "base64"));
  });
};
