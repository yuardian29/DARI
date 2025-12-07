
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudyExplanation = async (topic: string, grade: number): Promise<string> => {
  try {
    const prompt = `Jelaskan topik "${topic}" untuk siswa Sekolah Dasar kelas ${grade}.
    Gunakan bahasa yang sederhana, ceria, dan mudah dipahami anak-anak.
    Berikan 1 contoh nyata dalam kehidupan sehari-hari.
    Maksimal 150 kata.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Maaf, saya tidak dapat membuat penjelasan saat ini.";
  } catch (error) {
    console.error("Error generating explanation:", error);
    return "Terjadi kesalahan saat menghubungi asisten AI.";
  }
};

export const generateMotivation = async (subject: string): Promise<string> => {
  try {
    const prompt = `Buatlah satu kalimat motivasi pendek (max 20 kata) yang lucu dan menyemangati siswa SD untuk belajar mata pelajaran ${subject}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Ayo semangat belajar!";
  } catch (error) {
    return "Ayo semangat belajar!";
  }
};
