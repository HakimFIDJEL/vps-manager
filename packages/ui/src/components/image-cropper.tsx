"use client";

import React, { type SyntheticEvent } from "react";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
  convertToPixelCrop,
} from "react-image-crop";
import { FileWithPath } from "react-dropzone";

// Shadcn Components
import { Separator } from "@workspace/ui/components/separator";
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
import { CropIcon, Trash2, X } from "lucide-react";

// CSS
import "react-image-crop/dist/ReactCrop.css";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface ImageCropperProps {
  croppable?: boolean;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile: FileWithPreview | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  className?: string;
  onCropped?: (file: File) => void;
}

export function ImagePreview({
  croppable = true,
  src,
  className,
  handleDelete,
  handleCrop,
}: {
  croppable?: boolean;
  src: string | undefined;
  className?: string;
  handleDelete?: () => void;
  handleCrop?: () => void;
}) {
  return (
    <div
      className={`flex gap-4 h-full items-start justify-between ${className} flex-col md:flex-row`}
    >
      <Separator className="block md:hidden mb-4"/>
      <div className="relative md:w-64 md:h-64 rounded-xl overflow-hidden flex-shrink-0 w-full">
        <img
          src={`${src ? src : "/placeholder.svg?height=256&width=256"}`}
          alt="Background image"
          className="object-cover w-full h-full"
        />
      </div>
      {croppable && (
        <>
          <div className="flex md:flex-col flex-row gap-2 w-full">
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
              onClick={handleDelete}
            >
              <span>Delete</span>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <Separator className="block md:hidden"/>
        </>
      )}
    </div>
  );
}

export function ImageCropper({
  croppable = true,
  dialogOpen,
  setDialogOpen,
  selectedFile,
  setSelectedFile,
  className,
  onCropped, // callback pour renvoyer le fichier cropé
}: ImageCropperProps) {
  const aspect = 1;
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = React.useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = React.useState<string>("");

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      const croppedImageUrl = getCroppedImg(imgRef.current, crop);
      setCroppedImageUrl(croppedImageUrl);
    }
  }

  function getCroppedImg(image: HTMLImageElement, crop: PixelCrop): string {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;
    canvas.width = Math.round(cropWidth);
    canvas.height = Math.round(cropHeight);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context is null");
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(
      image,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      canvas.width,
      canvas.height
    );
    return canvas.toDataURL("image/png", 1.0);
  }

  // Fonction utilitaire pour convertir un dataURL en File
  function dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0]?.match(/:(.*?);/);
    if (!mimeMatch) {
      throw new Error("Invalid dataURL");
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]?.split(",")[1] || "");
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async function onCrop() {
    try {
      if (!croppedImageUrl) return;
      const fileName = selectedFile?.name || "cropped_image.png";
      const croppedFile = dataURLtoFile(croppedImageUrl, fileName);
      // On met à jour le fichier sélectionné avec la preview du crop
      setSelectedFile(Object.assign(croppedFile, { preview: croppedImageUrl }));
      // On renvoie le fichier cropé via le callback pour mettre à jour le formulaire
      if (onCropped) {
        onCropped(croppedFile);
      }
      setDialogOpen(false);
    } catch (error) {
      alert("Something went wrong!");
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <ImagePreview
          croppable={croppable}
          src={croppedImageUrl ? croppedImageUrl : selectedFile?.preview}
          className={className}
          handleDelete={() => {
            setSelectedFile(null);
          }}
          handleCrop={() => {
            setDialogOpen(true);
          }}
        />
      </DialogTrigger>
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
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
          >
            <img
              ref={imgRef}
              className="size-full rounded-none"
              alt="Image Cropper Shell"
              src={selectedFile?.preview}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <DialogFooter className="flex flex-row gap-2">
          <Button type="submit" onClick={onCrop}>
            Crop
            <CropIcon />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
