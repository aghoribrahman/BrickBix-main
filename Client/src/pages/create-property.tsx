import React, { useState } from 'react';
import {
  useGetIdentity,
  useActiveAuthProvider,
} from "@refinedev/core";
import { useForm } from '@refinedev/react-hook-form';
import { useNavigate } from 'react-router-dom';
import Form from '../components/common/Form';
import { FieldValues } from "react-hook-form";
import { useParams } from 'react-router-dom';
import Resizer from "react-image-file-resizer"; 

interface PropertyImage {
  name: string;
  url: string;
}

export const CreateProperty = () => {
  const navigate = useNavigate();
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { id } = useParams();
  const [propertyImage, setPropertyImage] = useState( {name:'', url:''} );
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
} = useForm({
  refineCoreProps: {
      action: "create",
      resource: "properties",
      id: id,
  },
});


const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      800, // Max width
      800, // Max height
      "JPEG", // Compression format
      80, // Quality (0-100)
      0, // Rotation
      (uri) => { // @ts-ignore
        resolve(uri); // Resolve with the resized image URI
      },
      "base64" // Output type
    );
  });
};

// Updated handleImageChange function to include resizing
const handleImageChange = async (file: File) => {
  try {
    const resizedImageUri = await resizeImage(file); // Resize the image
    setPropertyImage({ name: file.name, url: resizedImageUri }); // Set the resized image
  } catch (error) {
    console.error("Error resizing image:", error);
  }
};

const onFinishHandler = async (data: FieldValues) => {
  if (!propertyImage.name) return alert("Please select an image");

  await onFinish({
      ...data,
      photo: propertyImage.url,
      email: user.email,
  });
};

  return (
    <Form
      type='Create'
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImage={propertyImage}
    />
  )
};