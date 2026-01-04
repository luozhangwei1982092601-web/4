
import { GoogleGenAI } from "@google/genai";
import { FortuneInput, Language } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Face/Palm Reading Service
export const analyzePhysiognomy = async (base64Images: string[], language: Language): Promise<string> => {
  try {
    const langPrompt = {
      en: "English",
      zh: "Traditional Chinese (繁體中文)",
      es: "Spanish",
      ru: "Russian",
      fr: "French"
    }[language];

    // Create image parts for all uploaded images
    const imageParts = base64Images.map(imgData => ({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imgData
      }
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          ...imageParts,
          {
            text: `Act as a grandmaster of Chinese Physiognomy (Face Reading) and Palmistry (手相). Analyze these ${base64Images.length} image(s) combined with extreme detail.

            **Multi-Image Integration:**
            - If multiple hands are provided, compare Left (Innate/Born) vs Right (Acquired/Current) for a complete life trajectory.
            - If Face and Hand are provided, cross-reference the "Twelve Palaces" of the face with the "Mounts" of the hand for verification.

            **PALMISTRY CHECKLIST (Look for these in the hand images):**
            1. **The Three Main Lines (三大主紋):**
               - **Life Line (生命線):** Depth, length, and curve. Look for upward branches (Effort lines) or downward forks.
               - **Wisdom Line (智慧線):** Length and origin.
               - **Love/Emotion Line (感情線):** Curve and termination point. Look for "Phoenix Tail" (splits at the end).
            
            2. **Wealth & Career Indicators (財運與事業):**
               - **Fate/Career Line (事業線/玉柱紋):** Does it start from the base or the Moon Mount (貴人/Help from others)? Is it broken (job change) or straight?
                 *Note: Intersection with Wisdom line is approx age 35. Intersection with Love line is approx age 50-55.*
               - **Money Lines (財運線):** Vertical lines under the ring finger/little finger (Mercury/Sun mounts).
               - **Phoenix Eye (夫子眼/鳳眼紋):** An eye-shape on the thumb joint (sign of intelligence/good marriage).
               - **Ingot Shape (元寶紋):** A trapezoid shape formed by the intersection of Life, Head, and Fate lines (sign of holding wealth).
               - **M-Shape:** Do the main lines form a clear 'M'?
            
            3. **Special Marks & Mounts (符號與宮位):**
               - **Mount of Jupiter (巽宮 - Index finger base):** Look for grids (井字紋) or fullness (Leadership/Wealth).
               - **Ming Tang (明堂 - Center of palm):** Should be slightly concave (holding water/money).
               - **Triangles (三角紋):** On any main line, usually indicates a specific event or luck.
               - **Marriage Lines (婚姻線):** On the side of the palm under the pinky. Deep vs shallow.

            **FACE READING CHECKLIST (Look for these in face images):**
            Analyze the 'Twelve Palaces' (十二宮), specifically:
            - **Life Palace (命宮 - Between eyebrows):** Brightness and width.
            - **Wealth Palace (財帛宮 - Nose):** Size of nose tip and wings.
            - **Career Palace (官祿宮 - Forehead):** Smoothness and height.
            - **Parents Palace (父母宮):** Forehead sides.

            **Output Format:**
            Start with a respectful greeting.
            Then provide a structured analysis using these sections:
            - **【總體印象】 (Overall Impression)**
            - **【重點特徵分析】 (Key Features Analysis)**: List specific lines/marks found across all images (e.g., "Found a Phoenix Eye on thumb...", "Left hand shows... while Right hand shows...").
            - **【流年推斷】 (Timeline Prediction)**: If applicable (e.g., "Around age 35...").
            - **【大師建議】 (Master's Advice)**

            Tone: Mystical, traditional, encouraging, but honest.
            Output Language: ${langPrompt}.`
          }
        ]
      }
    });

    return response.text || "Could not interpret the image. Please ensure the hand or face is clearly visible.";
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};

// Divination Tools Service
export const consultDivination = async (
  type: 'dream' | 'match' | 'sticks' | 'number',
  inputData: any,
  language: Language
): Promise<string> => {
  try {
    const langPrompt = {
      en: "English",
      zh: "Traditional Chinese (繁體中文)",
      es: "Spanish",
      ru: "Russian",
      fr: "French"
    }[language];

    let systemContext = `You are a mystical master of Chinese Divination (玄學大師). Output Language: ${langPrompt}. Use Markdown.`;
    let userPrompt = "";

    if (type === 'dream') {
      userPrompt = `Perform "Duke of Zhou's Dream Interpretation" (周公解夢).
      Dream content: "${inputData.dream}".
      Explain the omen (Good/Bad) and what this symbol means in traditional Chinese culture.`;
    } else if (type === 'match') {
      userPrompt = `Perform "Name/Love Compatibility" (情感配對).
      Person 1: ${inputData.p1}. Person 2: ${inputData.p2}.
      Analyze the affinity based on Five Elements of the names (or general numerology).
      Give a "Compatibility Score" (0-100%) and advice.`;
    } else if (type === 'sticks') {
      userPrompt = `Perform "Divination Lots" (求籤 - e.g., Guanyin or Moon Elder).
      User's Question/Focus: "${inputData.question}".
      1. Randomly generate a Lot Number (e.g., 籤王, 上上籤, 中籤, 下下籤).
      2. Provide the "Poem" (籤詩).
      3. Provide the "Interpretation" (解籤) relative to the user's question.`;
    } else if (type === 'number') {
      userPrompt = `Perform "Number Numerology" (號碼吉凶 - 81數理).
      Number to analyze: "${inputData.number}" (Phone or Plate).
      Analyze the Feng Shui energy of these digits.
      Verdict: Auspicious or Inauspicious?`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemContext + userPrompt
    });

    return response.text || "The mists obscure the future.";
  } catch (error) {
    console.error("Divination error:", error);
    return "Error consulting the oracle.";
  }
};

// Fortune Calculation Service (Multi-mode)
export const calculateFortune = async (input: FortuneInput, language: Language): Promise<string> => {
  try {
    const langPrompt = {
      en: "English",
      zh: "Traditional Chinese (繁體中文)",
      es: "Spanish",
      ru: "Russian",
      fr: "French"
    }[language];

    // Use the client-side calculated lunar date if available to ensure strict accuracy
    const lunarString = input.lunarDate || "Unknown (Requires manual verification)";
    const todayDate = new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US');

    let systemContext = `You are the legendary 'Eastern Culture' Fortune Telling Master (东方文化算命大師). Output Language: ${langPrompt}. Use Markdown for formatting.
    
    CRITICAL INSTRUCTION:
    For EVERY response, you MUST begin with a dedicated 'Date Reference' section to verify the time.
    
    Format:
    ### 【日期對照】 (Date Reference)
    *   **公曆 (Gregorian):** ${input.birthDate} ${input.birthTime ? input.birthTime : ''}
    *   **出生地點 (Birth Location):** ${input.birthLocation || 'Unknown'}
    *   **農曆 (Lunar):** ${lunarString}
    
    ---
    (Then start the main analysis below)
    `;
    
    let userPrompt = '';

    const baseInfo = `
      Subject Info:
      Surname: ${input.surname}
      Name: ${input.name}
      Gender: ${input.gender}
      Blood Type: ${input.bloodType}
      Date: ${input.birthDate}
      Time: ${input.birthTime || 'Unknown'}
      Location: ${input.birthLocation || 'Unknown'}
      Lunar Date Info: ${lunarString}
      Today's Date: ${todayDate}
    `;

    if (input.type === 'full_report') {
      userPrompt = `
        Perform a **GRAND UNIFIED DESTINY REPORT** (全能命理報告) for the subject.
        ${baseInfo}
        
        This report MUST include ALL of the following sections. Be detailed but concise in each section.

        CRITICAL: At the very beginning of your response (BEFORE the Date Reference), output the calculated Bazi chart AND Name Analysis Score in a raw JSON code block.
        Include the 'naYin' (Na Yin Five Elements 納音) for each pillar (e.g., '海中金', '霹雳火', '大林木').
        Include a 'nameScore' (0-100) and 'nameVerdict' based on the name characters.
        
        Structure:
        \`\`\`json
        {
          "chart": {
            "year": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" },
            "month": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" },
            "day": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" },
            "hour": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" }
          },
          "nameAnalysis": {
            "score": 95,
            "verdict": "Excellent"
          }
        }
        \`\`\`

        After the Date Reference, provide the analysis in this order:

        # 1. 【姓名詳批】 (Name Analysis)
        - **Score (姓名評分):** State the score out of 100.
        - **Cultural Meaning (寓意):** Analyze the meaning of the characters ${input.surname}${input.name}.
        - **Three Talents (三才配置):** Briefly analyze the Heaven, Earth, Man structure.

        # 2. 【八字命盤分析】 (Bazi Analysis)
        - **Na Yin Destiny (納音命格):** Specifically state the Year Pillar Na Yin (e.g., Sea Gold 海中金) and explain its meaning.
        - **Main Destiny Star (命宮主星):** The Day Master.
        - **Five Elements Balance (五行喜忌):** Strengths/Weaknesses.
        - **Balancing Guide (五行開運):** Lucky Colors, Directions, Materials.
        - **Core Personality (性格特質):** Strengths, Weaknesses, Inner vs Outer Self.
        - **Love & Career (愛情與事業):** Relationship advice and career direction.
        - **Current Year Fortune (流年運勢):** Prediction for the current year.

        # 3. 【星座與生肖】 (Identity & Zodiac)
        - **Western Zodiac (星座):** Sun sign traits.
        - **Chinese Zodiac (生肖):** Animal sign characteristics.
        - **Birthday Code (生日密碼):** Numerology of the birth date.

        # 4. 【袁天罡稱骨算命】 (Bone Weight)
        - Calculate the Bone Weight based on the Lunar Date provided (${lunarString}).
        - State the Weight (e.g., 4 Liang 2 Qian).
        - **The Poem (歌訣):** Provide the traditional poem.
        - **Interpretation (批註):** Explain the poem's meaning for their life span and fortune.

        # 5. 【黃歷提示】 (Almanac Guidance)
        - Provide guidance based on the day of birth (what kind of day was it?).
        - Provide a brief 'Daily Horoscope' for Today (${todayDate}) for this person.
      `;
    } else if (input.type === 'bazi') {
      userPrompt = `
        Perform a comprehensive 'Bazi' (Eight Characters) analysis for the subject.
        ${baseInfo}
        
        CRITICAL: Output JSON chart first with Na Yin.
        Structure:
        \`\`\`json
        {
          "chart": {
            "year": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" },
            "month": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" },
            "day": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" },
            "hour": { "stem": "Char", "branch": "Char", "naYin": "NaYinChar" }
          }
        }
        \`\`\`

        Sections:
        ### 【納音命格】 (Na Yin Destiny)
        State the specific Na Yin (e.g., 劍鋒金, 山頭火) and its implications.
        ### 【命宮主星】 (Main Destiny Star)
        ### 【五行喜忌】 (Five Elements Balance)
        #### Five Elements Balancing Guide (五行開運指南)
        ### 【愛情提示】 (Love Tips)
        ### 【事業提示】 (Career Tips)
        ### 【財運提示】 (Wealth Tips)
        ### 【健康提示】 (Health Tips)
        ### 【性格提示】 (Personality Tips)
        #### Day Master Traits (日主特質)
        #### Strengths (優點)
        #### Weaknesses (缺點)
        #### Inner vs Outer Self (外在與內在)
        ### 【流年運勢】 (Current Year Fortune)
      `;
    } else if (input.type === 'zodiac') {
      userPrompt = `
        Perform a 'Identity & Zodiac' analysis for the subject.
        ${baseInfo}
        Include: 【星座算命】, 【你的生肖】, 【生日密碼】, 【配對建議】.
      `;
    } else if (input.type === 'bone_weight') {
      userPrompt = `
        Perform a 'Bone Weight' (袁天罡稱骨算命) calculation.
        ${baseInfo}
        1. Calculate weight based on LUNAR DATE: ${lunarString}.
        2. State weight.
        3. Poem.
        4. Interpretation.
      `;
    } else if (input.type === 'almanac') {
      userPrompt = `
        Perform a 'Almanac Query' (黃歷查詢) for the DATE provided: ${input.birthDate}.
        LUNAR DATE: ${lunarString}
        Include: Heavenly Stems/Branches, 【宜】 (Good for), 【忌】 (Bad for), Daily Stars/Gods, Daily Guidance.
      `;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemContext + userPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 4096 } // Increased budget for full report
      }
    });

    return response.text || "The stars are clouded today. Please try again.";
  } catch (error) {
    console.error("Error calculating fortune:", error);
    return "Error consulting the heavens.";
  }
};
