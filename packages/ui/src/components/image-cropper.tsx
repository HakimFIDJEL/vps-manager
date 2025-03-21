"use client";

// Necessary imports
import React, { useEffect } from "react";
import ReactCrop, {
  type Crop,
  type PixelCrop,
} from "react-image-crop";

// Shadcn Components
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogFooter,
  DialogTrigger,
  DialogHeader,
  DialogDescription,
} from "@workspace/ui/components/dialog";

// Icons
import { CropIcon } from "lucide-react";

// CSS
import "react-image-crop/dist/ReactCrop.css";

// Custom components
import { ImageUploadFile, ImageUploadInit } from "@workspace/ui/lib/image";

interface ImageCropperProps {
  file: ImageUploadFile | null;
  setFile: (file: ImageUploadFile | null) => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}


export function ImageCropper({
  file,
  setFile,
  dialogOpen=false,
  setDialogOpen,
}: ImageCropperProps) {

  const aspect = 1;
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  
  const [crop, setCrop] = React.useState<Crop>();
  const [croppedFile, setCroppedFile] = React.useState<ImageUploadFile | null>(file);
  const [originalFile, setOriginalFile] = React.useState<ImageUploadFile | null>(file);

  useEffect(() => {
    if (file) {
      setCroppedFile(file);
      setOriginalFile(file);
    }
  }, [file]);
  

  // Function called when the crop is complete
  async function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {

      const newFile = ImageUploadInit(await getCroppedFile(imgRef.current, crop));
      setCroppedFile(newFile);   
    }
  }

  // Function to get the cropped file
  function getCroppedFile(image: HTMLImageElement, crop: PixelCrop): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
  
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;
  
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context is null"));
  
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      );
  
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to create blob"));
        resolve(new File([blob], "cropped.png", { type: blob.type }));
      }, "image/png");
    });
  }
  

  // Function called when we validate the crop
  async function onCrop() {
    try {
      if (!croppedFile) return;
      
      setFile(croppedFile);
      setDialogOpen(false);
      setCrop(undefined);

    } catch (error) {
      alert("Something went wrong during crop.");
    }
  }
  

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="gap-0">
        <DialogHeader>
          <DialogTitle>Crop Image</DialogTitle>
          <DialogDescription>
            Crop your image to the desired size and position.
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 size-full">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
          >
            <img
              ref={imgRef}
              className="size-full rounded-none"
              alt="Image Cropper Shell"
              src={originalFile?.preview}
              // onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <DialogFooter className="flex flex-row gap-2">
          <Button type="submit" onClick={onCrop} disabled={(croppedFile == file) || !crop}>
            Crop
            <CropIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

