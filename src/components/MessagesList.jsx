import { useAITeacher } from "@/hooks/useAITeacher";
import { useEffect, useRef } from "react";

export const MessagesList = () => {
  const messages = useAITeacher((state) => state.messages);
  const playMessage = useAITeacher((state) => state.playMessage);
  const stopMessage = useAITeacher((state) => state.stopMessage);
  const { currentMessage } = useAITeacher();
  const english = useAITeacher((state) => state.english);
  const furigana = useAITeacher((state) => state.furigana);
  const classroom = useAITeacher((state) => state.classroom);

  const container = useRef();

  useEffect(() => {
    container.current.scrollTo({
      top: container.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div
      className={`w-[100%] h-[60%] p-8 flex flex-col space-y-8 bg-transparent opacity-80`} style={{ overflow: "scroll", marginTop: "15px" }}
      ref={container}
    >
      {
        messages.length === 0 && (
          <div className="h-full w-full grid place-content-center text-center">
            <p className="text-3xl font-bold text-white/90">
              ROBOLABS
            </p>

          </div>
        )
      }
      {
        messages.map((message, i) => (
          <div key={i}>
            <div className="flex flex-col">
              <div className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[75%] text-right mb-2">
                <h4 className="text-1xl font-bold text-white/90">{message.question}</h4>
              </div>
              <div className="self-start bg-gray-700 text-white px-4 py-2 rounded-lg max-w-[90%]">
                <div className="flex items-center gap-3">
                  <h4 className="text-1xl font-bold text-white/90">{message.answer}</h4>
                </div>

              </div>
              {currentMessage === message ? (
                <button
                  className="text-white/65"
                  onClick={() => stopMessage(message)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
                    />
                  </svg>
                </button>
              ) : (
                <button
                  className="text-white/65"
                  onClick={() => playMessage(message)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                    />
                  </svg>
                </button>
              )}
            </div>

          </div>
        ))
      }
    </div >
  );
};
