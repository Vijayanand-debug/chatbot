import { useAITeacher } from "@/hooks/useAITeacher";
import { useState, useRef } from "react";
import { FaMicrophone, FaMicrophoneAltSlash } from "react-icons/fa"; // Import microphone icons

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const getStudentId = useAITeacher((state) => state.getStudentData);
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // New state to hold error messages
  const inputRef = useRef(null); // Create a ref for the input field


  // Initialize the speech recognition API
  const recognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)
    ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    : null; // Ensure compatibility with different browsers (Chrome/Firefox/Safari)

  if (recognition) {
    recognition.lang = "en-US"; // Set the language to English
    recognition.continuous = false; // Stop listening after a single phrase
    recognition.interimResults = true; // Show results as the user is speaking
    recognition.maxAlternatives = 1; // Only take the best result

    // Event listener for when speech is recognized
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript; // The recognized text
      setQuestion(transcript);
      setIsListening(false); // Stop listening when speech is recognized

      // Move cursor to the end of the input field after setting the text
      if (inputRef.current) {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length); // Set cursor position to the end
        inputRef.current.focus(); // Ensure input is focused
      }
    };

    // Handle errors during speech recognition
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        setErrorMessage("No speech detected. Please try speaking again.");
      } else if (event.error === "audio-capture") {
        setErrorMessage("No microphone detected. Please ensure your microphone is working.");
      } else if (event.error === "not-allowed") {
        setErrorMessage("Microphone access denied. Please enable microphone access.");
      } else {
        setErrorMessage("An unknown error occurred. Please try again.");
      }

      setIsListening(false); // Stop listening on error
    };
  }

  // Start/Stop listening when the microphone is clicked
  const toggleListening = async () => {
    if (isListening) {
      await recognition.stop();
      await setIsListening(false);
    } else {
      await recognition.start();
      await setIsListening(true);
      await setErrorMessage(""); // Clear any previous error message when starting listening
    }
  };

  const ask = () => {
    const studentId = getStudentId();
    askAI(question, studentId);
    setQuestion(""); // Clear the question input after asking
  };

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-3 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">Hi! I Am IVY</h2>
        <p className="text-white/65">How can I assist you today?</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center" style={{ width: "90vw" }}>
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex">
          <input
            style={{ width: "50%" }}
            ref={inputRef} // Assign the ref to the input element
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="Type here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
          />
          <button
            className="p-2 rounded-full bg-slate-100/20 text-white"
            onClick={toggleListening}
          >
            {isListening ? (
              // Change to listening icon when it's in listening mode
              <FaMicrophoneAltSlash className="h-6 w-6 animate-spin" />
            ) : (
              // Use regular mic icon when not listening
              <FaMicrophone className="h-6 w-6" />
            )}
          </button>
          <button
            className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
            onClick={ask}
          >
            Ask
          </button>
        </div>
      )}

      {/* Display error message if there's any */}
      {errorMessage && (
        <div className="text-red-500 text-sm mt-2">
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  );
};