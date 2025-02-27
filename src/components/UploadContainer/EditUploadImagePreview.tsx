import Image from "next/image";
import { FaTrash } from "react-icons/fa";

/* eslint-disable @next/next/no-img-element */
interface Props {
  imageUrl: string;
  index: number;
  id?: string;
  handleImage?: (file: File) => void;
  handleDelete: (index: number, id?: string) => void;
}

function EditUploadImagePreview(props: Props) {
  return (
    <div className="m-1 w-4/6 lg:w-5/6 relative cursor-pointer transition-all p-1 border border-dashed rounded shadow bg-slate-100 flex justify-center flex-col">
      <Image
        width={500}
        height={500}
        src={props.imageUrl}
        alt="preview"
        className="rounded p-0.5 border object-contain aspect-square"
      />
  
        <button
          className="btn-red left-0 absolute top-0"
          type="button"
          onClick={() => props.handleDelete(props.index, props.id)}
        >
          <FaTrash className="w-3"/>
        </button>
    </div>
  );
}

export default EditUploadImagePreview;
