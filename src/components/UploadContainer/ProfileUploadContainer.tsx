/* eslint-disable @next/next/no-img-element */
"use client";

interface Props {
  handleImage: (file: File) => void;
  imageUrl?: string;
  editable?: boolean
}

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfileUploadContainer(props: Props) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  useEffect(() => {
    if (props.imageUrl !== undefined) {
      setProfileImage(props.imageUrl);
    }
  }, [props.imageUrl]);
  // const [imageList, setImageList] = useState<string[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      props.handleImage(e.target.files[0]);
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <>
      <div className="w-full p-12 h-full flex flex-row items-center align-middle justify-center ">
        <input
          id="profileImage"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          placeholder="Carregar imagem"
          accept="image/*"
        />
        {profileImage ? (
          <div className="flex flex-col justify-center items-center">
            <Image
              width={500}
              height={500}
              src={profileImage!}
              alt="preview"
              className="w-3/6 lg:w-4/5 mt-5 rounded object-contain my-3"
            />
            {props.editable && (

            
            <div className="mx-2 w-full flex flex-col justify-between">
              <button
                className="btn-red-o w-full"
                type="button"
                onClick={() => setProfileImage(null)}
              >
                Remover
              </button>
            </div>
             )} </div>
        ) : (
          <label
            htmlFor="profileImage"
            className="btn-black-o content-center w-full h-full text-center"
          >
            Clique aqui adicionar imagem
          </label>
        )}
      </div>
    </>
  );
}
