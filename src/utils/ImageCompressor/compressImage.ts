interface ImageCompressorArgs {
  file: File
  quality?: number
  type?: string
}
async function compressImage({
  file,
  quality = 1,
  type = file.type,
}: ImageCompressorArgs) {
  const imageBitmap = await createImageBitmap(file)

  const canvas = document.createElement("canvas") as HTMLCanvasElement
  canvas.width = imageBitmap.width
  canvas.height = imageBitmap.height
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
  ctx.drawImage(imageBitmap, 0, 0)

  const blob: Blob | null = await new Promise((resolve: BlobCallback) =>
    canvas.toBlob(resolve, type, quality)
  )

  if (!blob) throw new Error("Blob is null")

  return new File([blob], file.name, {
    type: blob.type,
  })
}

export { compressImage }
