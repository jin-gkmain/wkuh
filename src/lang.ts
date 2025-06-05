import ko from "@/lang/ko";
import en from "@/lang/en";
import kk from "@/lang/kk";
import mn from "@/lang/mn";

type LangFile = {
  [key: string]: {
    [key: string]: string;
  };
};

const lang: LangFile = {
  ko,
  en,
  kk,
  mn,
};

export default lang;

/**
 * 주어진 langFile 객체에서 특정 키에 해당하는 모든 언어의 값들을
 * { langCode: value } 형태의 딕셔너리로 반환합니다.
 * @param file LangFile 객체
 * @param targetKey 추출하고자 하는 언어 상수의 키
 * @returns { langCode: stringValue } 형태의 딕셔너리
 */
export function getAllValuesForConstantKeyAsDict(
  langfile: LangFile,
  targetKey: string
): Record<string, string> {
  const result: Record<string, string> = {};

  // Object.keys()와 forEach 사용
  // Object.keys(file).forEach(langCode => {
  //   const languagePack = file[langCode];
  //   if (languagePack && typeof languagePack[targetKey] === 'string') {
  //     result[langCode] = languagePack[targetKey];
  //   }
  // });
  // return result;

  // Object.entries()와 reduce 사용 (더 함수형 프로그래밍 스타일)
  return Object.entries(langfile).reduce((acc, [langCode, languagePack]) => {
    const value = languagePack[targetKey];
    if (typeof value === "string") {
      acc[langCode] = value;
    }
    return acc;
  }, {} as Record<string, string>); // 초기값은 빈 객체
}
