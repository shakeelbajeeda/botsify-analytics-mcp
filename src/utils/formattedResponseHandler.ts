/**
 * Format text response.
 * @param response
 * @returns TextResponse
 */
export const formatTextResponse = (response: string): any => {
    return {
        content: [
            {
                type: "text",
                text: response
            },
        ],
    } as any;
}