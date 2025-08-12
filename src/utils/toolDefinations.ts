/**
 * generalReportInstructions instructions.
 */
export const generalReportInstructions: string = `
Fetches the general chatbot activity report for the given date range.

**When to use:**
Use this tool whenever the user asks for ANY of the following metrics (individually or in combination):
- Chatbot users count
- Human help requested count
- Incoming messages count
- Outgoing messages count
- Or a general summary of chatbot statistics

**Input:**
- dateRange.startDate: Start date of the report (must be before end date)
- dateRange.endDate: End date of the report (must be after start date)

**Output:**
Returns an array of objects for direct table rendering, each containing:
- field: Metric name (string)
- value: Metric value (string or number)

Example Output:
[
  { "field": "users", "value": "0" },
  { "field": "total_users", "value": "0" },
  { "field": "human_help_requested", "value": "0" },
  { "field": "incoming_messages", "value": "0" },
  { "field": "outgoing_messages", "value": "0" },
  ...
]
`;

/**
 * usersReportInstructions instructions.
 */
export const usersReportInstructions: string = `
Fetches the users report showing the number of new users date wise for the given date range.

**When to use:**
Use this tool whenever the user asks for:
- User growth statistics
- New user counts
- User registration trends over time
- Daily/weekly/monthly user acquisition data
- User onboarding analytics

**Input:**
- dateRange.startDate: Start date of the range (must be before end date)
- dateRange.endDate: End date of the range (must be after start date)

**Output:**
Returns user registration data broken down by date, typically showing:
- chartData {labels, data}
- ....
`;

/**
 * platformReportInstructions instructions.
 */
export const platformReportInstructions: string = `
Fetches the platform specific report showing analytics data broken down by different platforms.

**When to use:**
Use this tool whenever the user asks for:
- Platform-specific statistics
- User behavior across different platforms
- Platform performance metrics
- Web vs mobile usage analytics
- Platform comparison data
- Cross-platform user engagement

**Input:**
- dateRange.startDate: Start date of the range (must be before end date)
- dateRange.endDate: End date of the range (must be after start date)

**Output:**
Returns platform analytics data typically showing:
- Platform type (web, mobile, iOS, Android, etc.)
- User count per platform
- Engagement metrics per platform
- Platform performance comparison
`;

/**
 * topMessagesReportInstructions instructions.
 */
export const topMessagesReportInstructions: string = `
Fetches the top messages report showing the most popular or frequently used messages.

**When to use:**
Use this tool whenever the user asks for:
- Message analytics
- Popular conversation topics
- Message frequency statistics
- Most common user queries
- Chatbot interaction patterns
- Message effectiveness metrics

**Input:**
- dateRange.startDate: Start date of the range (must be before end date)
- dateRange.endDate: End date of the range (must be after start date)

**Output:**
Returns message analytics data typically showing:
- Message content or type
- Frequency count
- User engagement metrics
- Message effectiveness scores
- Popular conversation flows
`;

/**
 * humanAgentReportInstructions instructions.
 */
export const humanAgentReportInstructions: string = `
Fetches the human agent details report showing conversation handling statistics for each agent.

**When to use:**
Use this tool whenever the user asks for:
- Agent performance metrics
- Conversation handling statistics
- Agent workload distribution
- Agent efficiency analysis
- Human support team analytics
- Agent productivity metrics

**Input:**
- dateRange.startDate: Start date of the range (must be before end date)
- dateRange.endDate: End date of the range (must be after start date)

**Output:**
Returns human agent performance data typically showing:
- Agent name/ID
- Number of conversations assigned
- Number of conversations solved
- Number of conversations open
- Resolution time metrics
- Agent efficiency scores
`;