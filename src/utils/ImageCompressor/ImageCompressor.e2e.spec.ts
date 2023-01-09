import { imageCompressor } from "./compressImage"

// grab image from current directory
import image from "./rain.mock.jpg"

describe("ImageCompressor", () => {
  it("should compress the image", async () => {
    // create a File object using the image import

    const file = new File([image], "rain.mock.jpg", { type: "image/jpeg" })
    expect(file).toBeInstanceOf(File)

    const sup = imageCompressor({ file })

    console.log(sup)
  })
})
