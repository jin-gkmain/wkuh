import myAxios from "@/utils/myAxios";

const CHATBOT_ENDPOINT = process.env.NEXT_PUBLIC_CHATBOT_ENDPOINT;

export interface ChatHistoryItem {
  outputs: string;
  inputs: string;
}

interface ChatRequestPayload {
  history: ChatHistoryItem[];
  question: string;
  category: string;
  model: string;
  prompt: string;
  multiquery: boolean;
  streaming: boolean;
}

interface ChatResponse {
  answer: string;
}

export const fetchChatbotResponse = async (
  history: ChatHistoryItem[],
  question: string
): Promise<string> => {
  const payload: ChatRequestPayload = {
    history,
    question,
    category: "A",
    model: "gpt-4o-mini",
    prompt: "",
    multiquery: false,
    streaming: false,
  };

  try {
    const response = await myAxios.post<ChatResponse>(
      CHATBOT_ENDPOINT,
      payload
    );
    if (response.data && response.data.answer) {
      return response.data.answer;
    }
    throw new Error("API 응답에서 answer를 찾을 수 없습니다.");
  } catch (error) {
    console.error("챗봇 API 호출 오류:", error);
    throw error;
  }
};

// 새로운 응답 타입 정의
interface DiseaseInfo {
  disease: string;
  definition: string;
  cause: string;
  symptom: string;
}

interface MedicineInfo {
  medicine: string;
  effects: string;
  usage: string;
  caution: string;
}

interface ChatbotAnalysisResponse {
  disease: DiseaseInfo[];
  medicine: MedicineInfo[];
}

export const fetchChatbot2Response = async (
  imageFile: File,
  streaming: boolean = false
): Promise<ChatbotAnalysisResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await myAxios.post<ChatbotAnalysisResponse>(
      `${CHATBOT_ENDPOINT}?streaming=${streaming}`,
      formData,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data) {
      return response.data;
    }
    throw new Error("API 응답 데이터를 찾을 수 없습니다.");
  } catch (error) {
    console.error("챗봇 이미지 분석 API 호출 오류:", error);
    throw error;
  }
};
