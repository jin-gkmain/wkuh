import myAxios from '@/utils/myAxios';

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
  streaming: boolean; // API 명세에 따라 true 또는 false로 설정, 혹은 제거
}

interface ChatResponse {
  answer: string;
}

export const fetchChatbotResponse = async (
  history: ChatHistoryItem[],
  question: string
): Promise<string> => {
  if (!CHATBOT_ENDPOINT) {
    console.error("챗봇 엔드포인트가 설정되지 않았습니다.");
    throw new Error("챗봇 설정을 확인해주세요.");
  }

  const payload: ChatRequestPayload = {
    history,
    question,
    category: "A", // 기본값 또는 필요에 따라 동적으로 설정
    model: "gpt-4o-mini", // 기본값 또는 필요에 따라 동적으로 설정
    prompt: "", // 기본값 또는 필요에 따라 동적으로 설정
    multiquery: false, // 기본값 또는 필요에 따라 동적으로 설정
    streaming: false, // 응답이 스트리밍이 아니므로 false 또는 API 명세 확인
  };

  try {
    const response = await myAxios.post<ChatResponse>(CHATBOT_ENDPOINT, payload);
    if (response.data && response.data.answer) {
      return response.data.answer;
    }
    throw new Error("API 응답에서 answer를 찾을 수 없습니다.");
  } catch (error) {
    console.error("챗봇 API 호출 오류:", error);
    // myAxios 인터셉터에서 오류를 처리할 수도 있으므로, 여기서 추가적인 오류 처리가 필요할 수 있습니다.
    // 예를 들어, 사용자에게 보여줄 기본 오류 메시지 반환 등
    throw error; // 또는 커스텀 오류 객체/메시지 반환
  }
}; 