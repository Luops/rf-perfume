/* eslint-disable @next/next/no-img-element */

interface Props {
  handleImage: (file: File) => void;
  imageUrl?: string;
}

export default function UploadContainer(props: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      props.handleImage(e.target.files![0]);
    }
  };

  return (
    <>
      <div className="m-1 flex flex-col justify-center items-stretch">
        <input
          id="image"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          placeholder="Carregar imagem"
          accept="image/*"
        />

        <label
          htmlFor="image"
          className="btn-green-o h-full flex flex-row justify-center items-center align-middle text-center font-bold text-2xl"
        >
          +
        </label>
      </div>
    </>
  );
}
