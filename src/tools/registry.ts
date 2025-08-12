import { registerAnalyticsTools } from "./analyticsTools.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerAllTools(server: McpServer) {
  registerAnalyticsTools(server);
}