import { FileWithPath } from "react-dropzone";

/**
 * @typedef {Object} ImageUploadFile
 * @description Represents a locally selected image file with an attached preview URL.
 *
 * @property {string} name - The file name (inherited from File)
 * @property {number} size - The file size in bytes (inherited from File)
 * @property {string} type - The MIME type of the file, e.g., "image/png" (inherited from File)
 * @property {string=} path - Optional file path provided by react-dropzone
 * @property {string} preview - A temporary preview URL generated with `URL.createObjectURL()`
 *
 * @note Extends `FileWithPath` from react-dropzone with a `preview` field.
 * @note Always call `URL.revokeObjectURL(preview)` when the preview is no longer needed to free memory.
 */

export type ImageUploadFile = FileWithPath & {
  preview: string;
};

export function ImageUploadInit(path: string): ImageUploadFile {
    
    // Create a new file object
    const file = new File([], path);

    // Create a preview URL
    const preview = URL.createObjectURL(file);

    // Return the file with the preview URL
    return Object.assign(file, { preview });
}