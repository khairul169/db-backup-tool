import Button from "./button";
import { IoChevronBack } from "react-icons/io5";

type BackButtonProps = {
  to: string;
};

const BackButton = ({ to }: BackButtonProps) => {
  return (
    <Button
      href={to}
      icon={IoChevronBack}
      variant="ghost"
      size="lg"
      className="-ml-4 px-4"
    >
      Back
    </Button>
  );
};

export default BackButton;
