import Image from "next/image";

/* eslint-disable @next/next/no-img-element */
interface Props {
  image: File;
  index: number;
  handleImage?: (file: File) => void;
  handleDelete: (index: number) => void;
}

function UploadPreview(props: Props) {
  const imageUrl = URL.createObjectURL(props.image);
  return (
    <div className="m-1 transition-all p-1 border border-dashed rounded shadow bg-slate-100 flex justify-between flex-row">
      <Image
        width={0}
        height={0}
        src={imageUrl}
        alt="preview"
        className="w-2/6 rounded p-0.5 border object-contain aspect-square"
      />
  
      <div className="mx-2 w-full flex flex-col justify-between">
        <p className="text-sm">{props.image.name}</p>
        <button
          className="btn-red w-full"
          type="button"
          onClick={() => props.handleDelete(props.index)}
        >
          Remover
        </button>
      </div>
    </div>
  );
}

export default UploadPreview;
