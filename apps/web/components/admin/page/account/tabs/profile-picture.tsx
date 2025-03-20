"use client";

// Necessary imports
import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Shadcn Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Separator } from "@workspace/ui/components/separator";

// Icons
import { Image, Loader2, Upload } from "lucide-react";

// Custom components
import { ImageUploader } from "@workspace/ui/components/image-uploader";
import { Input } from "@workspace/ui/components/input";
// import { ImageUploadFile, ImageUploadInit } from "@/lib/image";

const profilePictureFormSchema = z.object({
  profilePicture: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
    .refine(
        (file) => file.type.startsWith("image/"),
        "Only images are allowed"
    ),
});

type ProfilePictureFormValues = z.infer<typeof profilePictureFormSchema>;

export function ProfilePicture({ imagePath }: { imagePath?: string }) {


  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);


  const form = useForm<ProfilePictureFormValues>({
    resolver: zodResolver(profilePictureFormSchema),
  });


  useEffect(() => {

    if(imagePath) {
      const file = new File([], imagePath);
      setFile(file);
    }

  }, [imagePath]);


  function onSubmit(data: ProfilePictureFormValues) {
    setIsLoading(true);
    setTimeout(() => {
      console.log(data);
      setIsLoading(false);
    }, 1000);
  }

  return (
    <Card>
      <CardHeader className="bg-muted/50">
        <CardTitle className="flex items-center gap-2">
          <Image className="h-5 w-5 text-primary" />
          Profile picture
        </CardTitle>
        <CardDescription>
          Update your profile picture and edit your profile picture.
        </CardDescription>
      </CardHeader>

      <Separator className="md:mb-6 mb-2" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} encType="multipart/form-data">
          <CardContent className="grid gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex flex-col gap-3 flex-1">
              <FormField
                  control={form.control}
                  name="profilePicture"
                  render={({ field }) => {
                    // It is not possible to pass the `value` prop to a input type="file"
                    const { value, ...myField } = field;
                    return (
                      <FormItem>
                        <FormLabel>Profile Picture</FormLabel>
                        <FormControl>
                          <ImageUploader 
                            accept={[".jpeg", ".jpg", ".png"]}
                            maxSize={5 * 1024 * 1024}
                            file={file}
                            setFile={setFile}
                            zodField={myField}
                            croppable={false}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>

            </div>
            <Button type="submit" disabled={isLoading || !form.formState.isValid}>
              {isLoading ? "Uploading..." : "Upload"}
              {isLoading && <Loader2 className="animate-spin" />}
              {!isLoading && <Upload />}
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
