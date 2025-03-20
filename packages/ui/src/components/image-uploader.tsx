"use client";

import React, { useEffect } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "@workspace/ui/components/button";
import { Separator } from "@workspace/ui/components/separator";
import { CropIcon, Trash2, Upload } from "lucide-react";

import { ImageUploadFile, ImageUploadInit } from "@workspace/ui/lib/image.js";


import { ImageCropper } from "@workspace/ui/components/image-cropper"


interface ImageUploaderProps {
  accept?: Array<string>;
  maxSize?: number;
  file: ImageUploadFile | null;
  zodField: any;
  croppable?: boolean;
}

export function ImageUploader({
  accept = [".jpeg", ".jpg", ".png"],
  maxSize = 5 * 1024 * 1024,
  file,
  zodField,
  croppable = true,
}: ImageUploaderProps) {


  const [selectedFile, setSelectedFile] = React.useState<ImageUploadFile | null>(null);
  const [isDialogOpen, setDialogOpen] = React.useState(false);

  // Remove the selected file
  const handleRemove = () => {
    setSelectedFile(null);
    zodField.onChange(null);
  };

  const handleCrop = () => {
    setDialogOpen(true);
  }

  // Function called if we already have an image via its path
  useEffect(() => {
    if (file) {
      setSelectedFile(file);
      zodField.onChange(file);
    }
  }, [file]);

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const newFile = acceptedFiles[0];
      if (!newFile || !newFile.path) {
        alert("Selected image is too large!");
        return;
      }

      setSelectedFile(ImageUploadInit(newFile));
      zodField.onChange(newFile);

      if (croppable) {
        // setDialogOpen(true);
      }
    },
    [croppable]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": accept },
    maxSize: maxSize,
    multiple: false,
  });

  return (
    <>
      <div className="relative md:flex-row flex flex-col gap-6">
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
          <input {...zodField} {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">Drag & drop your image here</p>
          <p className="text-xs text-muted-foreground mb-4">or</p>
          <Button variant="secondary" type="button">
            Browse files
          </Button>
          <p className="text-xs text-muted-foreground mt-4">

            Accepted formats:
            {accept.map((format, i) => (
              <span key={i} className="font-medium">
                {format}
                {i < accept.length - 1 && ", "}
              </span>
            ))}

            <br />

            Max size: {maxSize / 1024 / 1024}MB
          </p>
        </div>

        {selectedFile && (
          <>
            <div className="col-span-1 flex justify-center items-stretch">
              <Separator orientation="vertical" className="h-full self-stretch" />
            </div>

            <div className="flex gap-4 h-full items-start justify-between col-span-4 flex-col md:flex-row">
              <Separator className="block md:hidden mb-4" />
              <div className="relative md:w-64 md:h-64 rounded-xl overflow-hidden flex-shrink-0 w-full">
                <img
                  src={`${selectedFile.preview ? selectedFile.preview : "/placeholder.svg?height=256&width=256"}`}
                  alt="Background image"
                  className="object-cover w-full h-full"
                />
                {croppable && (
                  <div className="hidden md:flex flex-col gap-2 w-full absolute items-center justify-center opacity-0 hover:opacity-100 hover:pointer-events-auto top-0 left-0 h-full transition-opacity duration-300 bg-muted/50 backdrop-blur-sm p-6">
                    <Button
                      variant="secondary"
                      className="w-full"
                      type="button"
                      onClick={handleCrop}
                    >
                      <span>Crop</span>
                      <CropIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      type="button"
                      onClick={handleRemove}
                    >
                      <span>Delete</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {croppable && (
                <>
                  <div className="md:hidden flex flex-row gap-2 w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      type="button"
                      onClick={handleCrop}
                    >
                      <span>Crop</span>
                      <CropIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      type="button"
                      onClick={handleRemove}
                    >
                      <span>Delete</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Separator className="md:hidden block" />
                </>
              )}
            </div>

            {/* <ImageCropper
              croppable={croppable}
              dialogOpen={isDialogOpen}
              setDialogOpen={setDialogOpen}
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              className="col-span-4"
              onCropped={onChange}
            /> */}
          </>
        )}
      </div>
      <ImageCropper
        file={selectedFile}
        setFile={setSelectedFile}
        dialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </>
  );
}
