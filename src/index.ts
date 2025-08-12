import 'dotenv/config.js';
import express from "express";
import cors from "cors";
import {randomUUID} from "node:crypto";
import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StreamableHTTPServerTransport} from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {isInitializeRequest} from "@modelcontextprotocol/sdk/types.js";
import {registerAllTools} from "./tools/registry.js";
import {requestContextMiddleware} from "./utils/requestContext.js";
import {instructions} from "./utils/instructions.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestContextMiddleware)

/**
 * Session store with metadata
 */
interface SessionRecord {
    sessionId: string;
    createdAt: number;
    updatedAt: number;
    deleteRequested: boolean;
    transport: StreamableHTTPServerTransport;
}

const sessions: { [sessionId: string]: SessionRecord } = {};

/**
 * Cleanup function to remove old sessions
 */
function cleanupOldSessions() {
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    for (const sessionId in sessions) {
        const session = sessions[sessionId];
        if (session && session.updatedAt < now - tenMinutes) {
            delete sessions[sessionId];
        }
    }
}

setInterval(cleanupOldSessions, 60 * 1000); // Run every minute

/**
 * Create MCP server
 */
const server = new McpServer({
    name: "botsify-analytics-mcp-server",
    version: "1.0.0"
}, {
    capabilities: {
        tools: {}
    },
    instructions
});

/**
 * Register all tools.
 */
registerAllTools(server)

/**
 * Get existing session transport or create new one.
 * @param sessionId
 */
async function getOrCreateTransport(sessionId: string | undefined) {
    if (sessionId && sessions[sessionId]) {
        sessions[sessionId].updatedAt = Date.now();
        return sessions[sessionId].transport;
    }
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
            sessions[id] = {
                sessionId: id,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                deleteRequested: false,
                transport,
            };
            console.log("Session initialized:", id);
        }
    });
    transport.onclose = () => {
        if (transport.sessionId) delete sessions[transport.sessionId];
    };
    await server.connect(transport);
    return transport;
}

/**
 * MCP post route.
 */
app.post("/mcp", authMiddleware, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    let transport: StreamableHTTPServerTransport;
    if (sessionId && sessions[sessionId]) {
        sessions[sessionId].updatedAt = Date.now();
        transport = sessions[sessionId].transport;
    } else if (!sessionId && isInitializeRequest(req.body)) {
        try {
            transport = await getOrCreateTransport(undefined);
        } catch (error) {
            res.status(500).json({error: "Failed to create transport"});
            return;
        }
    } else {
        res.status(400).json({
            jsonrpc: "2.0",
            error: {
                code: -32000,
                message: "Bad Request: No valid session ID provided"
            },
            id: null
        });
        return;
    }
    try {
        await transport.handleRequest(req, res, req.body);
        if (sessionId && sessions[sessionId]) {
            sessions[sessionId].updatedAt = Date.now();
        }
    } catch (error) {
        res.status(500).json({error: "Failed to handle request"});
    }
});

/**
 * handle session request.
 * @param req
 * @param res
 */
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !sessions[sessionId]) {
        res.status(400).send("Invalid or missing session ID");
        return;
    }
    const session = sessions[sessionId];
    session.updatedAt = Date.now();
    try {
        await session.transport.handleRequest(req, res);
        session.updatedAt = Date.now();
    } catch (error) {
        res.status(500).json({error: "Failed to handle session request"});
    }
};

app.get("/mcp", authMiddleware, handleSessionRequest);

/**
 * Delete mcp session.
 */
app.delete("/mcp", authMiddleware, async (req, res) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (sessionId && sessions[sessionId]) {
        sessions[sessionId].deleteRequested = true;
        sessions[sessionId].updatedAt = Date.now();
        // delete sessions[sessionId];
        res.status(200).send("Session deleted");
    } else {
        res.status(400).send("Invalid session ID");
    }
});

app.get('/', (req, res) => {
    res.json({
        status: 'Running'
    });
});

// Parse command line arguments
const argv = process.argv.slice(2);
const portArgIndex = argv.findIndex(arg => arg === "--port");
let port = process.env.PORT || 3000;
if (portArgIndex !== -1) {
    const portValue = argv[portArgIndex + 1];
    const parsedPort = portValue !== undefined ? parseInt(portValue, 10) : NaN;
    if (!isNaN(parsedPort)) port = parsedPort;
}

app.listen(port, () => {
    console.log(`MCP server running on http://localhost:${port}/mcp`);
});