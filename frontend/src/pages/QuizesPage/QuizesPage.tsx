import { useAppSelector } from "@/shared/ui/lib/hooks";

const QuizesPage = () => {
  const selectCurrentUser = useAppSelector((store) => store.currentUser);
  console.log(selectCurrentUser.info);
  return <div></div>;
};

export default QuizesPage;
