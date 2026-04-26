import { supabase } from "./supabaseClient";

function getFileExtension(fileName: string) {
  const parts = fileName.split(".");
  return parts.length > 1 ? parts.pop() : "png";
}

export async function uploadStoryImage(file: File) {
  const fileExtension = getFileExtension(file.name);
  const fileName = `${crypto.randomUUID()}.${fileExtension}`;
  const filePath = `stories/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("story-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from("story-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}