const { setGlobalOptions } = require("firebase-functions/v2");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const vision = require("@google-cloud/vision");

setGlobalOptions({ maxInstances: 10 });

const client = new vision.ImageAnnotatorClient();

exports.extractBillTotal = onCall(
  {
    timeoutSeconds: 60,
    memory: "1GiB",
  },
  async (request) => {
    try {
      console.log("Function invoked");

      if (!request.auth) {
        throw new HttpsError("unauthenticated", "Login required");
      }

      const imageBase64 = request.data?.image;
      if (!imageBase64) {
        throw new HttpsError("invalid-argument", "Image is required");
      }

      const [result] = await client.textDetection({
        image: { content: imageBase64 },
      });

      const text = result.fullTextAnnotation?.text || "";
      console.log("OCR TEXT:", text);

      const patterns = [
        /grand\s*total\s*[:\-]?\s*(₹?\s*\d+[.,]?\d*)/i,
        /total\s*amount\s*[:\-]?\s*(₹?\s*\d+[.,]?\d*)/i,
        /amount\s*payable\s*[:\-]?\s*(₹?\s*\d+[.,]?\d*)/i,
        /net\s*amount\s*[:\-]?\s*(₹?\s*\d+[.,]?\d*)/i,
        /total\s*[:\-]?\s*(₹?\s*\d+[.,]?\d*)/i,
      ];

      let totalAmount = null;

      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          totalAmount = Number(match[1].replace(/[₹,\s]/g, ""));
          break;
        }
      }

      return { totalAmount };
    } catch (error) {
      console.error("extractBillTotal failed:", error);
      throw new HttpsError("internal", "Failed to extract bill total");
    }
  }
);
