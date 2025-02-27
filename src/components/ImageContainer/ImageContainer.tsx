import Image from "next/image";
import CircularLoading from "../Loading/CircularLoading";

interface Props {
  pictureId: string;
}

export default function ImageContainer(props: Props) {
  return (
    <>
      <div className="w-full p-3 lg:w-3/4 mt-3 lg:m-3 flex flex-col flex-grow justify-center items-center">
        {props.pictureId ? (
          <Image
            width={1000}
            height={1000}
            className=" rounded transition-all hover:-translate-y-1 cursor-pointer"
            quality={100}
            src={props.pictureId}
            alt={props.pictureId}
          />
        ) : (
         <CircularLoading/>
        )}
      </div>
    </>
  );
}
