import { useState, useEffect } from "react";
import { QuizCategoryEnum, type CreateQuizDto } from "@infinite-quiz/common";
import {
  type QuizWizardState,
  useCreateQuizMutation,
  useUploadQuizImageMutation,
} from "@/entities/quiz/index";

export const useQuizEditorWizard = () => {
  const [step, setStep] = useState(1);
  const [validSteps, setValidSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuizWizardState, string>>
  >({});

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [uploadQuizImage, { isLoading: isUploading }] =
    useUploadQuizImageMutation();

  const isSubmitting = isCreating || isUploading;

  const [state, setState] = useState<QuizWizardState>({
    title: "",
    imageFile: null,
    category: QuizCategoryEnum.geography,
    pointsPerQuestion: 10,
    timePerQuestion: 20,
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  const updateState = (patch: Partial<QuizWizardState>) => {
    setState((prev) => {
      const newState = { ...prev, ...patch };
      if (patch.imageFile !== undefined) {
        setImagePreviewUrl((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl);
          return patch.imageFile ? URL.createObjectURL(patch.imageFile) : null;
        });
      }
      return newState;
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(patch).forEach(
        (key) => delete newErrors[key as keyof QuizWizardState],
      );
      return newErrors;
    });
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const validateStep = (stepId: number) => {
    let valid = true;
    const newErrors: Partial<Record<keyof QuizWizardState, string>> = {};

    if (stepId === 1) {
      if (state.title.trim().length < 3) {
        newErrors.title = "Минимум 3 символа";
        valid = false;
      }
      if (!state.imageFile) {
        newErrors.imageFile = "Загрузите изображение";
        valid = false;
      }
    }
    if (stepId === 2 && !state.category) {
      newErrors.category = "Выберите категорию";
      valid = false;
    }
    if (
      stepId === 3 &&
      (!state.pointsPerQuestion || state.pointsPerQuestion < 1)
    ) {
      newErrors.pointsPerQuestion = "Должно быть больше 0";
      valid = false;
    }
    if (stepId === 4 && (!state.timePerQuestion || state.timePerQuestion < 5)) {
      newErrors.timePerQuestion = "Минимум 5 секунд";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const next = () => {
    if (validateStep(step)) {
      setValidSteps((prev) => [...new Set([...prev, step])]);
      setStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (id: number) => {
    if (validSteps.includes(id) || id === step || id < step) {
      setStep(id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitWizard = async () => {
    try {
      const dto: CreateQuizDto = {
        title: state.title,
        category: state.category!,
        status: "draft",
        questions: [],
      };

      const createdQuiz = await createQuiz(dto).unwrap();
      console.log("Ответ сервера при создании квиза:", createdQuiz);

      const quizId = createdQuiz._id;
      console.log(quizId);
      if (state.imageFile && quizId) {
        await uploadQuizImage({ quizId, file: state.imageFile }).unwrap();
      }

      return {
        quiz: createdQuiz,
        questionDefaults: {
          pointsPerQuestion: state.pointsPerQuestion,
          timePerQuestion: state.timePerQuestion,
        },
      };
    } catch (e) {
      console.error("Ошибка при создании квиза или загрузке изображения:", e);
      throw e;
    }
  };

  return {
    step,
    validSteps,
    state,
    errors,
    updateState,
    next,
    back,
    goTo,
    submitWizard,
    isSubmitting,
    imagePreviewUrl,
  };
};
