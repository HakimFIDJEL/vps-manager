"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Card, CardContent } from "@workspace/ui/components/card"
import { ImageCropper } from "@workspace/ui/components/image-cropper"
import { FileWithPath, useDropzone } from "react-dropzone"

export type FileWithPreview = FileWithPath & {
  preview: string
}

const accept = {
  "image/*": [],
}

export function ImageUploader({

    ...props
}) {
  const [selectedFile, setSelectedFile] =
    React.useState<FileWithPreview | null>(null)
  const [isDialogOpen, setDialogOpen] = React.useState(false)

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0]
      if (!file) {
        alert("Selected image is too large!")
        return
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      })

      setSelectedFile(fileWithPreview)
      setDialogOpen(true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
  })

//   Ajoute ...props à getInputProps
  

  return (
    <div className="relative ">
      {/* {selectedFile ? (
        <ImageCropper
          dialogOpen={isDialogOpen}
          setDialogOpen={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
      ) : ( */}
        <Avatar
          {...getRootProps()}
          className="size-36 cursor-pointer ring-offset-2 ring-2 ring-slate-200"
        >
          <input {...getInputProps()} />
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>



      {/* )} */}

    </div>
  )
}