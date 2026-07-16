import { baseApi } from "@/shared/api";
import type {
  QuizWithQuestionsDto,
  QuizDto,
  UpdateQuizDto,
  CreateQuizDto,
} from "@infinite-quiz/common";

export const quizApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getQuizList: build.query<QuizDto[], void>({
      query: () => "/quizzes",
      providesTags: ["QuizList"],
    }),
    getQuiz: build.query<QuizWithQuestionsDto, string>({
      query: (id) => `/quizzes/${id}`,
      providesTags: ["CurrentQuiz"],
    }),
    createQuiz: build.mutation<QuizWithQuestionsDto, CreateQuizDto>({
      query: (body) => ({
        url: "/quizzes",
        method: "POST",
        body,
      }),
      invalidatesTags: ["QuizList"],
    }),
    updateQuiz: build.mutation<
      QuizWithQuestionsDto,
      { id: string; body: UpdateQuizDto }
    >({
      query: ({ id, body }) => ({
        url: `/quizzes/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["CurrentQuiz", "QuizList"],
    }),
    deleteQuiz: build.mutation<void, string>({
      query: (id) => ({
        url: `/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CurrentQuiz", "QuizList"],
    }),

    uploadQuizImage: build.mutation<QuizDto, { quizId: string; file: File }>({
      query: ({ quizId, file }) => {
        const formData = new FormData();
        formData.append("imageFilename", file);

        return {
          url: `/quizzes/${quizId}/image`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["CurrentQuiz", "QuizList"],
    }),
    publishQuiz: build.mutation<void, string>({
      query: (id) => ({
        url: `/quizzes/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: ["QuizList"],
    }),
  }),
});
export const {
  useGetQuizListQuery,
  useGetQuizQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
  useUploadQuizImageMutation,
  usePublishQuizMutation,
} = quizApi;
