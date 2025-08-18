import type {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {z} from "zod";
import {apiRequest} from "../services/apiRequestService.js";
import {
    generalReportInstructions,
    usersReportInstructions,
    platformReportInstructions,
    topMessagesReportInstructions,
    humanAgentReportInstructions
} from "../utils/toolDefinations.js";
import {formatTextResponse} from "../utils/formattedResponseHandler.js";

export function registerAnalyticsTools(server: McpServer) {
    /**
     * Get general report
     */
    server.registerTool(
        "getGeneralReport",
        {
            description: generalReportInstructions,
            inputSchema: {
                dateRange: z.object({
                    startDate: z.coerce.date().describe("The start date of the range (must be before end date)"),
                    endDate: z.coerce.date().describe("The end date of the range (must be after start date)"),
                })
                    .refine(
                        (data) => data.startDate < data.endDate,
                        {
                            message: "Start date must be before end date",
                            path: ["startDate"],
                        }
                    )
            },
        },
        async (args: { dateRange: { startDate: Date; endDate: Date } }) => {
            const {dateRange} = args;
            const normalized = {
                startDate: new Date(dateRange.startDate).toISOString(),
                endDate: new Date(dateRange.endDate).toISOString(),
            };

            try {
                const result = await apiRequest<any>("GET", "/v1/analytics-report/overallStats", {
                    params: {
                        dateRange: JSON.stringify(normalized)
                    },
                });
                if (result.success) {
                    const response = {
                        response: {
                            data: [result.data],
                            previewType: 'table',
                            filters: ['dateRange'],
                            filtersData: {
                                dateRange: normalized
                            },
                            apiPath: '/v1/analytics-report/overallStats',
                            apiMethod: 'GET'
                        }
                    }
                    return formatTextResponse(`${JSON.stringify(response)}`);
                } else {
                    return formatTextResponse(`Failed to fetch: ${result.error}`);
                }
            } catch (error) {
                return formatTextResponse(`Error while fetching report: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }
    );

    /**
     * Get users report - number of new users date wise
     */
    server.registerTool(
        "getUsersReport",
        {
            description: usersReportInstructions,
            inputSchema: {
                dateRange: z.object({
                    startDate: z.coerce.date().describe("The start date of the range (must be before end date)"),
                    endDate: z.coerce.date().describe("The end date of the range (must be after start date)"),
                })
                    .refine(
                        (data) => data.startDate < data.endDate,
                        {
                            message: "Start date must be before end date",
                            path: ["startDate"],
                        }
                    )
            },
        },
        async (args: { dateRange: { startDate: Date; endDate: Date } }) => {
            const {dateRange} = args;
            const normalized = {
                startDate: new Date(dateRange.startDate).toISOString(),
                endDate: new Date(dateRange.endDate).toISOString(),
            };

            try {
                const result = await apiRequest<any>("GET", "/v1/analytics-report/usersList", {
                    params: {
                        dateRange: JSON.stringify(normalized)
                    },
                });
                if (result.success) {
                    const response = {
                        response: {
                            data: result.data.data,
                            previewType: 'table',
                            filters: ['dateRange'],
                            filtersData: {
                                dateRange: normalized
                            },
                            apiPath: '/v1/analytics-report/usersList',
                            apiMethod: 'GET'
                        }
                    }
                    return formatTextResponse(`${JSON.stringify(response)}`);
                } else {
                    return formatTextResponse(`Failed to fetch users report: ${result.error}`);
                }
            } catch (error) {
                return formatTextResponse(`Error while fetching users report: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }
    );

    /**
     * Get platform specific report
     */
    server.registerTool(
        "getPlatformReport",
        {
            description: platformReportInstructions,
            inputSchema: {
                dateRange: z.object({
                    startDate: z.coerce.date().describe("The start date of the range (must be before end date)"),
                    endDate: z.coerce.date().describe("The end date of the range (must be after start date)"),
                })
                    .refine(
                        (data) => data.startDate < data.endDate,
                        {
                            message: "Start date must be before end date",
                            path: ["startDate"],
                        }
                    )
            },
        },
        async (args: { dateRange: { startDate: Date; endDate: Date } }) => {
            const {dateRange} = args;
            const normalized = {
                startDate: new Date(dateRange.startDate).toISOString(),
                endDate: new Date(dateRange.endDate).toISOString(),
            };

            try {
                const result = await apiRequest<any>("GET", "/v1/analytics-report/userPlatform", {
                    params: {
                        dateRange: JSON.stringify(normalized)
                    },
                });
                if (result.success) {
                    const response = {
                        response: {
                            data: [result.data],
                            previewType: 'table',
                            filters: ['dateRange'],
                            filtersData: {
                                dateRange: normalized
                            },
                            apiPath: '/v1/analytics-report/userPlatform',
                            apiMethod: 'GET'
                        }
                    }
                    return formatTextResponse(`${JSON.stringify(response)}`);
                } else {
                    return formatTextResponse(`Failed to fetch platform report: ${result.error}`);
                }
            } catch (error) {
                return formatTextResponse(`Error while fetching platform report: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }
    );

    /**
     * Get top messages report
     */
    server.registerTool(
        "getTopMessagesReport",
        {
            description: topMessagesReportInstructions,
            inputSchema: {
                dateRange: z.object({
                    startDate: z.coerce.date().describe("The start date of the range (must be before end date)"),
                    endDate: z.coerce.date().describe("The end date of the range (must be after start date)"),
                })
                    .refine(
                        (data) => data.startDate < data.endDate,
                        {
                            message: "Start date must be before end date",
                            path: ["startDate"],
                        }
                    )
            },
        },
        async (args: { dateRange: { startDate: Date; endDate: Date } }) => {
            const {dateRange} = args;
            const normalized = {
                startDate: new Date(dateRange.startDate).toISOString(),
                endDate: new Date(dateRange.endDate).toISOString(),
            };

            try {
                const result = await apiRequest<any>("GET", "/v1/analytics-report/messages", {
                    params: {
                        dateRange: JSON.stringify(normalized)
                    },
                });
                if (result.success) {
                    const response = {
                        response: {
                            data: result.data,
                            previewType: 'table',
                            filters: ['dateRange'],
                            filtersData: {
                                dateRange: normalized
                            },
                            apiPath: '/v1/analytics-report/messages',
                            apiMethod: 'GET'
                        }
                    }
                    return formatTextResponse(`${JSON.stringify(response)}`);
                } else {
                    return formatTextResponse(`Failed to fetch top messages report: ${result.error}`);
                }
            } catch (error) {
                return formatTextResponse(`Error while fetching top messages report: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }
    );

    /**
     * Get human agent details report
     */
    server.registerTool(
        "getHumanAgentReport",
        {
            description: humanAgentReportInstructions,
            inputSchema: {
                dateRange: z.object({
                    startDate: z.coerce.date().describe("The start date of the range (must be before end date)"),
                    endDate: z.coerce.date().describe("The end date of the range (must be after start date)"),
                })
                    .refine(
                        (data) => data.startDate < data.endDate,
                        {
                            message: "Start date must be before end date",
                            path: ["startDate"],
                        }
                    )
            },
        },
        async (args: { dateRange: { startDate: Date; endDate: Date } }) => {
            const {dateRange} = args;
            const normalized = {
                startDate: new Date(dateRange.startDate).toISOString(),
                endDate: new Date(dateRange.endDate).toISOString(),
            };

            try {
                const result = await apiRequest<any>("GET", "/v1/analytics-report/humanAgents", {
                    params: {
                        dateRange: JSON.stringify(normalized)
                    },
                });
                if (result.success) {
                    const response = {
                        response: {
                            data: [result.data],
                            previewType: 'table',
                            filters: ['dateRange'],
                            filtersData: {
                                dateRange: normalized
                            },
                            apiPath: '/v1/analytics-report/messages',
                            apiMethod: 'GET'
                        }
                    }
                    return formatTextResponse(`${JSON.stringify(response)}`);
                } else {
                    return formatTextResponse(`Failed to fetch human agent report: ${result.error}`);
                }
            } catch (error) {
                return formatTextResponse(`Error while fetching human agent report: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        }
    );
}

