import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  getDatabase,
  getDbStats,
  resetDatabaseToDefaults,
  getAllUsers,
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  getAllTopics,
  getAllLessons,
  createLesson,
  updateLesson,
  deleteLesson,
  getAllQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getAllExams,
  createExam,
  deleteExam,
  getAllExamResults,
  createExamResult,
  getBookmarks,
  toggleBookmark,
  updateBookmark,
  removeBookmark
} from "./server/db.js";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  // Pre-initialize SQLite Database
  try {
    await getDatabase();
    console.log("SQLite database initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize SQLite database:", err);
  }

  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // ==================== SQLITE DB API ROUTES ====================

  // 1. Database Health & Stats
  app.get("/api/db/stats", async (req, res) => {
    try {
      const stats = await getDbStats();
      res.json({ success: true, dbType: "sqlite3", stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/db/reset", async (req, res) => {
    try {
      const stats = await resetDatabaseToDefaults();
      res.json({ success: true, message: "Database reset to defaults successfully", stats });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 2. Users & Auth API
  app.get("/api/users", async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json({ success: true, data: users });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username) {
        return res.status(400).json({ success: false, message: "Tên đăng nhập không được để trống." });
      }
      const user = await getUserByUsername(username);
      if (!user) {
        return res.status(404).json({ success: false, message: "Tên đăng nhập không tồn tại trong cơ sở dữ liệu SQLite." });
      }
      if (password && user.password && user.password !== password) {
        return res.status(401).json({ success: false, message: "Mật khẩu không chính xác." });
      }
      res.json({ success: true, data: user });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = req.body;
      const existing = await getUserByUsername(userData.username);
      if (existing) {
        return res.status(409).json({ success: false, message: "Tên đăng nhập đã tồn tại trong cơ sở dữ liệu SQLite." });
      }
      const newUser = {
        ...userData,
        id: userData.id || `user_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const created = await createUser(newUser);
      res.json({ success: true, data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updated = await updateUser(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy người dùng." });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 3. Topics & Lessons API
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await getAllTopics();
      res.json({ success: true, data: topics });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get("/api/lessons", async (req, res) => {
    try {
      const lessons = await getAllLessons();
      res.json({ success: true, data: lessons });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/lessons", async (req, res) => {
    try {
      const lessonData = req.body;
      const newLesson = {
        ...lessonData,
        id: lessonData.id || `lesson_${Date.now()}`,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      const created = await createLesson(newLesson);
      res.json({ success: true, data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/lessons/:id", async (req, res) => {
    try {
      const updated = await updateLesson(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy bài học." });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/lessons/:id", async (req, res) => {
    try {
      await deleteLesson(req.params.id);
      res.json({ success: true, message: "Đã xóa bài học khỏi SQLite." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 4. Questions API
  app.get("/api/questions", async (req, res) => {
    try {
      const questions = await getAllQuestions();
      res.json({ success: true, data: questions });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = req.body;
      const newQ = {
        ...questionData,
        id: questionData.id || `q_${Date.now()}`
      };
      const created = await createQuestion(newQ);
      res.json({ success: true, data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/questions/:id", async (req, res) => {
    try {
      const updated = await updateQuestion(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ success: false, message: "Không tìm thấy câu hỏi." });
      }
      res.json({ success: true, data: updated });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/questions/:id", async (req, res) => {
    try {
      await deleteQuestion(req.params.id);
      res.json({ success: true, message: "Đã xóa câu hỏi khỏi SQLite." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 5. Exams API
  app.get("/api/exams", async (req, res) => {
    try {
      const exams = await getAllExams();
      res.json({ success: true, data: exams });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/exams", async (req, res) => {
    try {
      const examData = req.body;
      const newExam = {
        ...examData,
        id: examData.id || `exam_${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const created = await createExam(newExam);
      res.json({ success: true, data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/exams/:id", async (req, res) => {
    try {
      await deleteExam(req.params.id);
      res.json({ success: true, message: "Đã xóa đề thi khỏi SQLite." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 6. Exam Results API
  app.get("/api/exam-results", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const results = await getAllExamResults(userId);
      res.json({ success: true, data: results });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/exam-results", async (req, res) => {
    try {
      const resultData = req.body;
      const newResult = {
        ...resultData,
        id: resultData.id || `res_${Date.now()}`
      };
      const created = await createExamResult(newResult);
      res.json({ success: true, data: created });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // 7. Bookmarks API
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = req.query.userId as string | undefined;
      const bookmarks = await getBookmarks(userId);
      res.json({ success: true, data: bookmarks });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post("/api/bookmarks/toggle", async (req, res) => {
    try {
      const { userId, questionId, note, masteryStatus } = req.body;
      const result = await toggleBookmark(userId || 'user_student_1', questionId, note, masteryStatus);
      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put("/api/bookmarks", async (req, res) => {
    try {
      const { userId, questionId, note, masteryStatus } = req.body;
      await updateBookmark(userId || 'user_student_1', questionId, note, masteryStatus);
      res.json({ success: true, message: "Đã cập nhật ghi chú sổ tay trong SQLite." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.delete("/api/bookmarks", async (req, res) => {
    try {
      const { userId, questionId } = req.body;
      await removeBookmark(userId || 'user_student_1', questionId);
      res.json({ success: true, message: "Đã xóa câu hỏi khỏi sổ tay SQLite." });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiAvailable: !!process.env.GEMINI_API_KEY, db: "sqlite3" });
  });

  // AI Endpoint: Generate Question for Informatics Exam
  app.post("/api/ai/generate-question", async (req, res) => {
    try {
      const { topicId, topicTitle, difficulty, questionType } = req.body;
      const ai = getAI();

      if (!ai) {
        // High-quality fallback template when no API key is provided
        return res.json({
          success: true,
          source: "local-template",
          data: {
            content: `Cho biết phát biểu nào sau đây là ĐÚNG khi nói về nội dung "${topicTitle || 'Chủ đề Tin học'}"?`,
            type: questionType || "single_choice",
            options: [
              "Hệ quản trị cơ sở dữ liệu cung cấp công cụ tạo lập, lưu trữ và khai thác CSDL an toàn.",
              "Khóa chính của bảng có thể nhận giá trị trùng lặp giữa các bản ghi.",
              "Mạng máy tính không thể kết nối các thiết bị không cùng hệ điều hành.",
              "Bản quyền phần mềm không áp dụng đối với các tài liệu số hóa trên Internet."
            ],
            correctAnswer: "A",
            explanation: `Theo chuẩn kiến thức chương trình Tin học THPT, hệ quản trị CSDL đóng vai trò trung gian quản lý và cung cấp các phương thức thao tác dữ liệu nhất quán.`,
            cognitiveLevel: difficulty || "TH",
            subQuestions: questionType === "true_false" ? [
              { label: "a", statement: "Hệ quản trị CSDL quan hệ lưu trữ dữ liệu dưới dạng các bảng 2 chiều.", isCorrect: true, explanation: "Đúng theo định nghĩa mô hình dữ liệu quan hệ." },
              { label: "b", statement: "Khóa chính cho phép nhận giá trị rỗng (NULL).", isCorrect: false, explanation: "Sai, khóa chính phải có tính toàn vẹn thực thể (không được NULL và không được trùng lặp)." },
              { label: "c", statement: "Ngôn ngữ SQL cho phép định nghĩa và truy vấn dữ liệu.", isCorrect: true, explanation: "Đúng, SQL gồm DDL và DML." },
              { label: "d", statement: "Mọi bảng trong CSDL quan hệ đều bắt buộc phải có ít nhất 2 khóa ngoại.", isCorrect: false, explanation: "Sai, bảng có thể không có khóa ngoại nào." }
            ] : undefined
          }
        });
      }

      const prompt = `Bạn là chuyên gia khảo thí và giáo viên Tin học THPT xuất sắc tại Việt Nam.
Hãy biên soạn 1 câu hỏi trắc nghiệm Tin học chuẩn format Đề thi Tốt nghiệp THPT Quốc gia theo chương trình GDPT 2018.
Chủ đề: ${topicTitle || topicId} (${topicId})
Độ khó: ${difficulty || "Thông hiểu"} (NB: Nhận biết, TH: Thông hiểu, VD: Vận dụng, VDC: Vận dụng cao)
Loại câu hỏi: ${questionType === "true_false" ? "Trắc nghiệm Đúng/Sai (gồm 1 ngữ cảnh/câu lệnh và 4 ý a, b, c, d)" : "Trắc nghiệm 4 lựa chọn A, B, C, D"}

Hãy trả về định dạng JSON hợp lệ theo cấu trúc:
{
  "content": "Nội dung câu dẫn / đoạn mã / đề bài",
  "type": "${questionType === "true_false" ? "true_false" : "single_choice"}",
  "options": ["Nội dung đáp án A", "Nội dung đáp án B", "Nội dung đáp án C", "Nội dung đáp án D"],
  "correctAnswer": "A",
  "explanation": "Lời giải thích chi tiết, ngắn gọn, khoa học",
  "subQuestions": [
    {"label": "a", "statement": "Phát biểu a", "isCorrect": true, "explanation": "Giải thích"},
    {"label": "b", "statement": "Phát biểu b", "isCorrect": false, "explanation": "Giải thích"},
    {"label": "c", "statement": "Phát biểu c", "isCorrect": true, "explanation": "Giải thích"},
    {"label": "d", "statement": "Phát biểu d", "isCorrect": false, "explanation": "Giải thích"}
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, source: "gemini", data: parsed });
    } catch (err: any) {
      console.error("AI Question generation error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate question" });
    }
  });

  // AI Endpoint: Generate Smart Diagnostic Analysis for Student
  app.post("/api/ai/diagnose-results", async (req, res) => {
    try {
      const { score, totalQuestions, breakdownByTopic, weakTopics, strongTopics } = req.body;
      const ai = getAI();

      if (!ai) {
        return res.json({
          success: true,
          analysis: {
            summary: `Bạn đạt ${score.toFixed(2)}/10.0 điểm. Bạn làm tốt ở các chủ đề: ${strongTopics.join(', ') || 'Cơ bản'}.`,
            strengths: strongTopics.length > 0 ? strongTopics.map((t: string) => `Nắm vững kiến thức trọng tâm về ${t}.`) : ["Có nền tảng làm bài cẩn thận."],
            weaknesses: weakTopics.length > 0 ? weakTopics.map((t: string) => `Cần bổ sung và làm thêm bài tập chuyên đề ${t}.`) : ["Cần tăng tốc độ xử lý câu hỏi Đúng/Sai."],
            actionPlan: [
              "1. Ôn lại lý thuyết các bài học bị sai nhiều trong mục 'Tham khảo lý thuyết'.",
              "2. Làm lại các câu hỏi đã lưu vào 'Sổ tay câu hỏi khó'.",
              "3. Luyện tập thêm 2 đề thi thử chuẩn 50 phút để rèn luyện kỹ năng phân bổ thời gian."
            ]
          }
        });
      }

      const prompt = `Bạn là Cố vấn học tập và Giáo viên Tin học THPT giàu kinh nghiệm.
Dưới đây là kết quả bài thi thử Tốt nghiệp THPT Quốc gia môn Tin học của học sinh:
- Điểm số: ${score}/10.0
- Tổng số câu: ${totalQuestions}
- Các chủ đề làm tốt (Mạnh): ${strongTopics.join(', ') || 'Chưa có'}
- Các chủ đề làm sai nhiều (Yếu / Cần củng cố): ${weakTopics.join(', ') || 'Chưa có'}
- Thống kê chi tiết theo chủ đề: ${JSON.stringify(breakdownByTopic)}

Hãy phân tích sư phạm ngắn gọn, tích cực, khoa học và đưa ra lời khuyên cụ thể giúp học sinh bứt phá điểm số trong kỳ thi Tốt nghiệp THPT sắp tới.
Trả về JSON:
{
  "summary": "Đánh giá tổng quan năng lực và nhận xét sư phạm",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Lỗ hổng kiến thức 1", "Lỗ hổng kiến thức 2"],
  "actionPlan": ["Bước 1...", "Bước 2...", "Bước 3..."]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ success: true, analysis: parsed });
    } catch (err: any) {
      console.error("AI Diagnose error:", err);
      return res.status(500).json({ error: err.message || "Failed to analyze results" });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tin Học THPT Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
