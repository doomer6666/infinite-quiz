// import { DocumentType } from "@typegoose/typegoose";
// import { QuizEntity } from "../quiz.entity.js";

// const safeId = (obj: any): string => {
//   if (!obj) return "";
//   if (typeof obj === "string") return obj;
//   if (obj._id) return obj._id.toString();
//   if (obj.id) return obj.id.toString();
//   return obj.toString ? obj.toString() : String(obj);
// };

// export function toQuizResponse(quiz: DocumentType<QuizEntity>) {
//   if (!quiz) return null;

//   return {
//     id: safeId(quiz._id || quiz.id),
//     hostId: safeId(quiz.hostId),
//     title: quiz.title || "",
//     imageFilename: quiz.imageFilename || "default.png",
//     questionCount: Number(quiz.questionCount ?? 0),
//     pointsCount: Number(quiz.pointsCount ?? 0),
//     status: quiz.status || "draft",
//     category: quiz.category,
//   };
// }

// export function toFullQuizResponse(quiz: DocumentType<QuizEntity>) {
//   if (!quiz) return null;

//   return {
//     ...toQuizResponse(quiz),
//     questions: Array.isArray(quiz.questions)
//       ? quiz.questions.map((q: any) => ({
//           id: safeId(q._id || q.id),
//           text: q.text || "",
//           points: Number(q.points ?? 0),
//           timeLimit: Number(q.timeLimit ?? 0),
//           imageFilename: q.imageFilename,
//           answers: Array.isArray(q.answers)
//             ? q.answers.map((a: any) => ({
//                 id: safeId(a._id || a.id),
//                 text: a.text || "",
//                 isCorrect: Boolean(a.isCorrect),
//               }))
//             : [],
//         }))
//       : [],
//   };
// }
