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

function resolveEnvironment(raw: string | undefined): Environment {
  if (raw && (ENVIRONMENTS as readonly string[]).includes(raw)) {
    return raw as Environment;
  }
  return "development";
}

const onBeforeRun: OnBeforeRunProvider = async (agentId: string) => {
  console.log(agentId);
  return {
    tools: {
      runTime: {},
      global: {
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
          description: "The current user name",
          value: "Jane Doe",
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
  const agenticPlatformAgent = import.meta.env.VITE_DEFAULT_AGENT_ID;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const environment = resolveEnvironment(
    import.meta.env.VITE_AGENTIC_PLATFORM_ENV
  );
  const iframeUrl: string = CHAT_UI_URLS[environment];

  const provideConfig = useCallback(
    (): ChatUiConfiguration => ({
      agentId: agenticPlatformAgent,
      environment,
      uiConfig: {
        theme: "light",
        contentVariant: ContentVariants.Chat,
        variant: ChatUiVariants.Minimal,
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
                placeholder: "Ask me anything",
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
    <div className="w-screen h-screen bg-gray-200">
      <div className="w-96 text-2xl font-bold px-5 pt-5">Your Application</div>
      <div className="w-96 text-xl px-5">Agentic AI Platform UI via iframe</div>
      <iframe
        ref={iframeRef}
        src={iframeUrl}
        className="w-[500px] h-[calc(100vh-40px)] border border-gray-300 fixed top-[20px] right-[20px] z-[1000] rounded-xl shadow-lg"
      />
    </div>
  );
}

export default App;
