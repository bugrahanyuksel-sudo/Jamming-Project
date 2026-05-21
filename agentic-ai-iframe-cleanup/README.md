# React 19 Iframe Example

This project demonstrates how to use React 19 with Trimble ID (TID) authentication in an iframe context.

## Prerequisites

Before getting started, you'll need:

- Node.js and npm installed
- Access to Trimble's Artifactory
- A Trimble ID client configuration

## Setup Instructions

### 1. Configure Trimble ID Authentication

This template uses the official Trimble React TID package. For detailed setup instructions, visit the [Trimble ID React package documentation](https://www.npmjs.com/package/@trimble-oss/trimble-id-react).

Create a `.env` file in the project root with your TID configuration. You can use the `.env.example` file as a template:

```env
VITE_TID_CLIENT_ID=YOUR_CLIENT_ID
VITE_TID_SCOPES=openid,agents,iam,kb
VITE_DEFAULT_AGENT_ID=YOUR_AGENT_ID
```

**Important:** Make sure your Trimble ID application includes the required scopes listed above (`openid,agents,iam,kb`) for the agentic platform to function properly.

### 2. Set up NPM Registry Access

1. Navigate to [Trimble's Artifactory](https://artifactory.trimble.tools/)
2. Go to your profile and copy your API token
3. Update the `.npmrc.template` file with your API token
4. Rename the file from `.npmrc.template` to `.npmrc`

### 3. Install Dependencies

Install all required packages:

```sh
npm install
```

### 4. Start Development Server

Launch the development server:

```sh
npm run dev
```

The application will be available at the URL shown in your terminal (typically `http://localhost:5173`).

## Environments

The example is configured to connect to the development environment of the Agentic Platform:

- **Iframe URL**: `https://studio.dev.trimble-ai.com/embedded`
- **Environment**: `development`

For staging use, you would update the `iframeUrl` and `environment` configuration accordingly.

- **Iframe URL**: `https://studio.stage.trimble-ai.com/embedded`
- **Environment**: `stage`

## onBeforeRun: Tools and Run Context

This example demonstrates how to provide tools and run context to your agent through the `onBeforeRun` provider. The `OnBeforeRunProvider` is called before each agent run and returns an `OnBeforeRunConfig` containing both tool definitions/callbacks and dynamic run context.

### Important: Agent System Prompt Configuration

**For run context to work properly, you must add `{run.context}` to your agent's system prompt in the Trimble AI Studio.**

1. Go to [Trimble AI Studio](https://studio.trimble-ai.com/admin)
2. Edit your agent's system prompt
3. Add `{run.context}` somewhere in the prompt where you want the context information to appear

Example system prompt:

```text
You are a helpful assistant. Here is the current context:

{run.context}
```

### Implementation Details

The example code shows how to implement the `onBeforeRun` provider, which returns both tools and run context:

```typescript
const onBeforeRun: OnBeforeRunProvider = async (agentId: string) => {
  return {
    tools: {
      runTime: {},
      global: {
        get_uuid: {
          callback: async (args) => {
            return window.crypto.randomUUID();
          },
        },
        get_current_time: {
          callback: async (args) => {
            return new Date().toISOString();
          },
        },
      },
    },
    runContext: {
      context: [
        {
          description: "The current user name",
          value: "Jane Doe",
        },
      ],
    },
  };
};
```

Tools are organized into two categories:

- **`global`**: Tools shared across all runs (e.g., utility functions like `get_uuid`)
- **`runTime`**: Per-run tools that may vary between invocations

The `runContext` array can contain multiple objects, each with a `description` and `value` field that will be formatted and inserted into your agent's system prompt where `{run.context}` appears.

### Available Tools

1. **get_current_time**: Returns the current time in ISO format
2. **get_uuid**: Generates and returns a unique UUID

### Adding Your Own Tools

To add custom tools, add an entry to the `global` (or `runTime`) object inside the `onBeforeRun` return value:

```typescript
const onBeforeRun: OnBeforeRunProvider = async (agentId) => {
  return {
    tools: {
      runTime: {},
      global: {
        get_weather: {
          callback: async (args) => {
            const location = args.location as string;
            return `Weather in ${location}: Sunny, 72°F`;
          },
        },
      },
    },
    runContext: { context: [] },
  };
};
```
