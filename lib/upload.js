export default async function uploadFile(scribbleDataURI) {
  const data = new FormData();
  data.append("file", scribbleDataURI);
  data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  data.append("folder", "Scribble_Uploads");
  console.log(data);
  console.log(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const res = await response.json();
    console.log(res);
    return res.secure_url;
  } catch (error) {
    console.log(error);
  }
}
