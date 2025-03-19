"use client";

import React from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { Upload } from "lucide-react";
import { ImageCropper, FileWithPreview } from "@workspace/ui/components/image-cropper";

const accept = {
  "image/*": [],
};

interface ImageUploaderProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  onChange?: (file: File) => void;
  croppable?: boolean;
  children?: React.ReactNode;
}


export function ImageUploader({ onChange, croppable=true, children, ...props }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = React.useState<FileWithPreview | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        alert("Selected image is too large!");
        return;
      }
      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setSelectedFile(fileWithPreview);
  
      // Si vous souhaitez mettre à jour le formulaire dès le drop, appelez onChange
      if (onChange) {
        onChange(file);
      }
  
      // Si vous voulez aussi laisser la possibilité de cropper, vous pouvez ouvrir le dialogue
      if (croppable) {
        setDialogOpen(true);
      }
    },
    [croppable, onChange]
  );
  

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxSize: 5242880, // 5MB
    multiple: false,
  });

  return (
    <div className="relative md:grid md:grid-cols-12 flex flex-col gap-4 md:gap-0">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors w-full ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/20"
        } 
          ${selectedFile ? "md:col-span-7" : "md:col-span-12"}
          hover:border-primary hover:bg-primary/5`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Drag & drop your image here
        </p>
        <p className="text-xs text-muted-foreground mb-4">or</p>
        <Button variant="secondary" type="button">
          Browse files
        </Button>
        <p className="text-xs text-muted-foreground mt-4">
          PNG, JPG (max. 5MB)
        </p>
      </div>

      {selectedFile && (
        <>
          <div className="col-span-1 flex justify-center items-stretch">
            <Separator orientation="vertical" className="h-auto self-stretch" />
          </div>
          <ImageCropper
            croppable={croppable}
            dialogOpen={isDialogOpen}
            setDialogOpen={setDialogOpen}
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            className="col-span-4"
            onCropped={onChange}
          />
        </>
      )}
    </div>
  );
}
