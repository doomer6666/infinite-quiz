import { useState, useEffect, useRef } from "react";
import {
  QuizCategoryEnum,
  type CreateQuizDto,
  type QuizCategory,
  type UpdateQuizDto,
} from "@infinite-quiz/common";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useUploadQuizImageMutation,
  type QuizWizardState,
} from "@/entities/quiz/index";

const safeRevoke = (url: string | null) => {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
};

export type WizardInitialData = Partial<
  Omit<QuizWizardState, "imageFile" | "category">
> & {
  imagePreviewUrl?: string | null;
  category?: QuizCategory;
};

export const useQuizEditorWizard = (
  quizId?: string,
  initialData?: WizardInitialData,
) => {
  const isEditMode = !!quizId;

  const [step, setStep] = useState(1);
  const [validSteps, setValidSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof QuizWizardState, string>>
  >({});

  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [updateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();
  const [uploadQuizImage, { isLoading: isUploading }] =
    useUploadQuizImageMutation();

  const isSubmitting = isCreating || isUpdating || isUploading;

  const [state, setState] = useState<QuizWizardState>(() => ({
    title: initialData?.title ?? "",
    imageFile: null,
    category: initialData?.category ?? QuizCategoryEnum.geography,
    pointsPerQuestion: initialData?.pointsPerQuestion ?? 10,
    timePerQuestion: initialData?.timePerQuestion ?? 20,
  }));

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(
    initialData?.imagePreviewUrl ?? null,
  );
  const imageUrlRef = useRef<string | null>(
    initialData?.imagePreviewUrl ?? null,
  );

  const updateState = (patch: Partial<QuizWizardState>) => {
    if (patch.imageFile !== undefined) {
      safeRevoke(imageUrlRef.current);
      const newUrl = patch.imageFile
        ? URL.createObjectURL(patch.imageFile)
        : null;
      imageUrlRef.current = newUrl;
      setImagePreviewUrl(newUrl);
    }

    setState((prev) => ({ ...prev, ...patch }));

    setErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(patch).forEach(
        (key) => delete newErrors[key as keyof QuizWizardState],
      );
      return newErrors;
    });
  };

  useEffect(() => {
    return () => safeRevoke(imageUrlRef.current);
  }, []);

  const validateStep = (stepId: number) => {
    let valid = true;
    const newErrors: Partial<Record<keyof QuizWizardState, string>> = {};

    if (stepId === 1) {
      if (state.title.trim().length < 3) {
        newErrors.title = "Минимум 3 символа";
        valid = false;
      }
      if (!state.imageFile && !imagePreviewUrl) {
        newErrors.imageFile = "Загрузите изображение";
        valid = false;
      }
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
      if (isEditMode && quizId) {
        const dto: UpdateQuizDto = {
          title: state.title,
          category: state.category,
        };

        await updateQuiz({ id: quizId, body: dto }).unwrap();

        if (state.imageFile) {
          await uploadQuizImage({ quizId, file: state.imageFile }).unwrap();
        }

        return {
          quiz: { _id: quizId },
          questionDefaults: {
            pointsPerQuestion: state.pointsPerQuestion,
            timePerQuestion: state.timePerQuestion,
          },
        };
      } else {
        const dto: CreateQuizDto = {
          title: state.title,
          category: state.category,
          status: "draft",
          questions: [],
        };

        const createdQuiz = await createQuiz(dto).unwrap();
        const newQuizId = createdQuiz._id;

        if (state.imageFile && newQuizId) {
          await uploadQuizImage({
            quizId: newQuizId,
            file: state.imageFile,
          }).unwrap();
        }

        return {
          quiz: createdQuiz,
          questionDefaults: {
            pointsPerQuestion: state.pointsPerQuestion,
            timePerQuestion: state.timePerQuestion,
          },
        };
      }
    } catch {
      /* empty */
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
