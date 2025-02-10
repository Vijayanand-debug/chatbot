const {create} = require("zustand");
// import {create} from "zustand";

export const teachers = ["Nanami", "Naoki"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null; // New teacher, new Voice
        return message;
      }),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({
      classroom,
    }));
  },
  loading: false,
  furigana: true,
  setFurigana: (furigana) => {
    set(() => ({
      furigana,
    }));
  },
  english: true,
  setEnglish: (english) => {
    set(() => ({
      english,
    }));
  },
  speech: "formal",
  setSpeech: (speech) => {
    set(() => ({
      speech,
    }));
  },
  askAI: async (question, studentId) => {
    if (!question) {
      return;
    }
    const message = {
      question,
      id: get().messages.length,
    };
    set(() => ({
      loading: true,
    }));

    const speech = get().speech;
    // Ask AI
    await fetch(`/api/ai?question=${question}&studentId=${studentId}`)
    .then(res =>{

      return res.json();

    })
    .then(aiAnswer =>{
      message.answer = aiAnswer.data.response;
      message.speech = speech;

      set(() => ({
        currentMessage: message,
      }));
  
      set((state) => ({
        messages: [...state.messages, message],
        loading: false,
      }));
      get().playMessage(message);

    })
    .catch(error=>{
      console.error('Fetch Error: ', error);
      message.answer = 'Something went wrong';
      message.speech = speech;

      set(() => ({
        currentMessage: message,
      }));
  
      set((state) => ({
        messages: [...state.messages, message],
        loading: false,
      }));
      get().playMessage(message);
    });
    
  },
  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
    }));

    if (!message.audioPlayer) {
      set(() => ({
        loading: true,
      }));
      // Get TTS
      // console.log(`message from tts ${JSON.stringify(message.answer)}`);
      const audioRes = await fetch(
        `/api/tts?teacher=${get().teacher}&text=${message.answer}`
      );
      const audio = await audioRes.blob();
      const visemes = JSON.parse(await audioRes.headers.get("visemes"));
      const audioUrl = URL.createObjectURL(audio);
      const audioPlayer = new Audio(audioUrl);

      message.visemes = visemes;
      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set(() => ({
          currentMessage: null,
        }));
      };
      set(() => ({
        loading: false,
        messages: get().messages.map((m) => {
          if (m.id === message.id) {
            return message;
          }
          return m;
        }),
      }));
    }

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },
  stopMessage: (message) => {
    message.audioPlayer.pause();
    set(() => ({
      currentMessage: null,
    }));
  },
  studentId: 0,
  setStudentData: (id) => {
    set({
      studentId : id
    });
  },
  getStudentData :()=>{
    return get().studentId;

  },
}));

