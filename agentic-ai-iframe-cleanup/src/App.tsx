import {
  CHAT_UI_URLS,
  ChatUiVariants,
  ContentVariants,
  listenToChatUi,
  listenToChatUiEvents,
  type Environment,
  type ChatUiConfiguration,
  type OnBeforeRunProvider,
} from "@trimble-agentic-external-npm-local/agentic-platform-sdk-iframe-typescript";
import { useAuth } from "@trimble-oss/trimble-id-react";
import { useCallback, useEffect, useRef } from "react";

const ENVIRONMENTS: Environment[] = ["development", "stage", "prod"];
const viteEnv =
  ((import.meta as unknown as { env?: Record<string, string | undefined> }).env) ||
  {};
const JAMMING_API_BASE_URL =
  viteEnv.VITE_JAMMING_API_BASE_URL || "http://localhost:8000";

function resolveEnvironment(raw: string | undefined): Environment {
  if (raw && (ENVIRONMENTS as readonly string[]).includes(raw)) {
    return raw as Environment;
  }
  return "development";
}

const onBeforeRun: OnBeforeRunProvider = async (agentId: string) => {
  console.log(agentId);

  const analyzeUploadedSpectrogram = async (args: Record<string, unknown>) => {
    const uploadId =
      args && typeof args.uploadId === "string" ? args.uploadId.trim() : "";

    const response = await fetch(
      `${JAMMING_API_BASE_URL}/assistant/analyze-upload`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadId ? { uploadId } : {}),
      }
    );

    if (!response.ok) {
      let detail = `${response.status} ${response.statusText}`;
      try {
        const payload = await response.json();
        if (payload && typeof payload.detail === "string") {
          detail = payload.detail;
        }
      } catch {
        // Keep fallback detail.
      }
      return `Could not analyze uploaded spectrogram. ${detail}`;
    }

    const payload = await response.json();
    if (payload && typeof payload.summaryText === "string") {
      return payload.summaryText;
    }
    return JSON.stringify(payload);
  };

  return {
    tools: {
      runTime: {
        analyze_uploaded_spectrogram: {
          definition: {
            name: "analyze_uploaded_spectrogram",
            description:
              "Analyze the spectrogram image the user uploaded in the main app and return RF/GNSS interference findings in plain language.",
            parameters: {
              type: "object",
              properties: {
                uploadId: {
                  type: "string",
                  description:
                    "Optional upload ID. If omitted, the backend uses the latest uploaded spectrogram.",
                },
              },
            },
          },
          callback: analyzeUploadedSpectrogram,
          timeOutInMs: 30000,
        },
        analyze_latest_upload: {
          definition: {
            name: "analyze_latest_upload",
            description:
              "Use this when the user says things like 'analyze the uploaded image', 'analyze the spectrogram', or 'review the file I uploaded'.",
            parameters: {
              type: "object",
              properties: {},
            },
          },
          callback: analyzeUploadedSpectrogram,
          timeOutInMs: 30000,
        },
      },
      global: {
        get_uploaded_spectrogram_analysis: {
          callback: analyzeUploadedSpectrogram,
        },
        get_uuid: {
          callback: async (args) => {
            console.log(args);
            return window.crypto.randomUUID();
          },
        },
        get_current_time: {
          callback: async (args) => {
            console.log(args);
            return new Date().toISOString();
          },
        },
      },
    },
    runContext: {
      context: [
        {
          description: "Tool usage rule",
          value:
            "If the user asks to analyze, inspect, review, interpret, or summarize an uploaded image/spectrogram, ALWAYS call analyze_latest_upload first, then explain results in plain language.",
        },
        {
          description: "Fallback tool alias",
          value:
            "If analyze_latest_upload is unavailable, call analyze_uploaded_spectrogram. If that is unavailable, call get_uploaded_spectrogram_analysis.",
        },
        {
          description: "Natural prompt mapping",
          value:
            "Treat these user requests as tool intent: 'analyze the uploaded spectrogram', 'what do you see in the image', 'review my uploaded file', 'interpret this spectrogram'.",
        },
      ],
    },
  };
};

function App() {
  /** Add your valid TID token here */
  const { getAccessTokenSilently } = useAuth();

  /** Add your valid Agent ID here.
   * In case you need to create an agent first checkout https://studio.trimble-ai.com/admin. */
  const agenticPlatformAgent = viteEnv.VITE_DEFAULT_AGENT_ID || "";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const environment = resolveEnvironment(
    viteEnv.VITE_AGENTIC_PLATFORM_ENV
  );
  const iframeUrl: string = CHAT_UI_URLS[environment];

  const provideConfig = useCallback(
    (): ChatUiConfiguration => ({
      agentId: agenticPlatformAgent,
      environment,
      uiConfig: {
        theme: "light",
        contentVariant: ContentVariants.Chat,
        variant: ChatUiVariants.Full,
        chatInput: {
          buttons: [],
          hideModelSelection: false,
        },
      },
      localization: {
        translations: {
          en: {
            chat: {
              input: {
                placeholder: "Ask naturally, e.g. 'Can you analyze the image I just uploaded?'",
              },
            },
          },
        },
      },
    }),
    [environment]
  );

  useEffect(() => {
    if (!iframeRef.current) {
      return;
    }

    const unsubscribe = listenToChatUi(
      iframeRef.current,
      new URL(iframeUrl).origin,
      provideConfig,
      getAccessTokenSilently,
      onBeforeRun
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [
    iframeRef,
    agenticPlatformAgent,
    getAccessTokenSilently,
    iframeUrl,
    provideConfig,
  ]);

  useEffect(() => {
    const url = new URL(iframeUrl);
    const unsubscribe = listenToChatUiEvents(url.origin, (event) => {
      console.log(event);
    });
    return unsubscribe;
  }, [iframeUrl]);

  return (
    <div className="w-screen h-screen bg-blue-50">
      <div className="w-96 text-2xl font-bold px-5 pt-5">Terrasat Jamming Detection + Trimble Assist</div>
      <div className="w-96 text-xl px-5">Agentic AI Jamming Platform</div>
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        className="w-[500px] h-[calc(100vh-40px)] border border-gray-300 fixed top-[20px] right-[20px] z-[1000] rounded-xl shadow-lg"
      />
    </div>
  );
}

export default App;
