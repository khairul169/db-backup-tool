import { cn } from "@/lib/utils";
import Helmet from "react-helmet";

type Props = {
  children?: string;
  setTitle?: boolean;
  className?: string;
};

const PageTitle = ({ children, setTitle = true, className }: Props) => {
  return (
    <>
      {setTitle && (
        <Helmet>
          <title>{children}</title>
        </Helmet>
      )}

      <h2 className={cn("text-3xl font-medium text-gray-800", className)}>
        {children}
      </h2>
    </>
  );
};

export default PageTitle;
