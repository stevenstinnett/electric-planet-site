import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Busboy from "busboy";

export const handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed. Use POST." })
    };
  }

  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: event.headers
    });

    let fields = {};
    let fileBuffer = null;
    let fileName = null;
    let mimeType = null;

    // Capture text fields
    busboy.on("field", (fieldname, value) => {
      fields[fieldname] = value;
    });

    // Capture file
    busboy.on("file", (fieldname, file, info) => {
      fileName = info.filename;
      mimeType = info.mimeType;

      const chunks = [];
      file.on("data", (chunk) => chunks.push(chunk));
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    // When parsing is finished
    busboy.on("finish", async () => {
      try {
        if (!fileBuffer) {
          resolve({
            statusCode: 400,
            body: JSON.stringify({ error: "No file uploaded" })
          });
          return;
        }

        // Create R2 client
        const r2 = new S3Client({
          region: "auto",
          endpoint: process.env.R2_ENDPOINT,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
          }
        });

        // Unique key for the file
        const key = `${Date.now()}-${fileName}`;

        // Upload to R2
        await r2.send(
          new PutObjectCommand({
            Bucket: process.env.R2_BUCKET,
            Key: key,
            Body: fileBuffer,
            ContentType: mimeType || "application/octet-stream"
          })
        );

        // Public URL
        const publicUrl = `${process.env.R2_ENDPOINT}/${process.env.R2_BUCKET}/${key}`;

        resolve({
          statusCode: 200,
          body: JSON.stringify({
            message: "Upload successful",
            url: publicUrl,
            fields
          })
        });
      } catch (err) {
        console.error("Upload error:", err);
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: "Upload failed", details: err.message })
        });
      }
    });

    // Feed the raw body into Busboy
    busboy.end(Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8"));
  });
};
