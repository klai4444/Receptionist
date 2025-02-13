"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOpenAIResponse = void 0;
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const cors_1 = __importDefault(require("cors"));
const openai_1 = __importDefault(require("openai"));
const corsHandler = (0, cors_1.default)({ origin: true });
// Initialize OpenAI
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
exports.getOpenAIResponse = (0, https_1.onRequest)(async (request, response) => {
    corsHandler(request, response, async () => {
        var _a, _b;
        try {
            logger.info("Received request", {
                method: request.method,
                path: request.path,
                body: request.body,
            });
            if (request.method !== "POST") {
                logger.warn("Method not allowed", { method: request.method });
                return response.status(405).json({ error: "Method not allowed" });
            }
            const userMessage = request.body.message;
            if (!userMessage) {
                logger.warn("Missing message in request");
                return response.status(400).json({ error: "Message is required" });
            }
            // Call OpenAI API
            const completion = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful virtual receptionist." },
                    { role: "user", content: userMessage },
                ],
            });
            const botReply = ((_b = (_a = completion.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "I didn't understand that.";
            logger.info("OpenAI response received", { message: botReply });
            return response.status(200).json({ reply: botReply });
        }
        catch (error) {
            logger.error("Error processing request", { error: error instanceof Error ? error.message : error });
            return response.status(500).json({ error: "Something went wrong" });
        }
    });
});
//# sourceMappingURL=index.js.map