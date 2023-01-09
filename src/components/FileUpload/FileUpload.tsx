import { ChangeEvent, Fragment, useState } from "react"
import styles from "./FileUpload.module.css"
import { compressImage } from "../../utils/ImageCompressor/compressImage"

const bytesToMegabytes = (bytes: number = 0) => {
  return (bytes / 1000000).toFixed(2)
}

interface BeforeAndAfterProps {
  compressedFiles: File[]
  files: File[]
}
const BeforeAndAfter = ({ compressedFiles, files }: BeforeAndAfterProps) => {
  const filePairs = compressedFiles.map((compressedFile) => {
    const file = files.find((file) => file.name === compressedFile.name)
    return { compressedFile, file }
  })

  return (
    <div className={styles.FileUploadBeforeAndAfter}>
      <div>Before</div>
      <div>After</div>
      {filePairs.map(({ file, compressedFile }) => (
        <Fragment key={compressedFile.name}>
          <div>
            {file?.name} <strong>{bytesToMegabytes(file?.size)} mb</strong>
          </div>

          <div>
            {compressedFile?.name}{" "}
            <strong>{bytesToMegabytes(compressedFile?.size)} mb</strong>
          </div>
        </Fragment>
      ))}
    </div>
  )
}

const FileUpload = () => {
  const [error, setError] = useState<string | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [compressedFiles, setCompressedFiles] = useState<File[]>([])
  const [qualityDial, setQualityDial] = useState(0.5)
  const showBeforeAndAfter =
    compressedFiles.length > 0 && !isCompressing && !error

  const handleOnChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setCompressedFiles([])
    setFiles([])
    setError(null)

    const { files } = e.target

    setIsCompressing(true)

    try {
      if (!files?.length) return

      const dataTransfer = new DataTransfer()

      setFiles(Array.from(files))

      for (const file of files) {
        if (!file.type.startsWith("image")) {
          dataTransfer.items.add(file)
          continue
        }

        // Compress the file by 50%
        const compressedFile = await compressImage({
          file,
          quality: qualityDial,
          type: "image/jpeg",
        })

        setCompressedFiles((prev) => [...prev, compressedFile])

        dataTransfer.items.add(compressedFile)
      }

      e.target.files = dataTransfer.files
    } catch (error) {
      console.error(error)
      setError("Unable to compress file. Please verify the file type.")
    } finally {
      setIsCompressing(false)
    }
  }

  const handleQualityChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setQualityDial(parseFloat(value))
  }

  return (
    <div className={styles.FileUploadContainer}>
      <input
        type="file"
        multiple
        id="FileUpload"
        className={styles.FileUpload}
        title="File upload"
        onChange={handleOnChange}
      />
      <label htmlFor="quality" className={styles.FileUploadQuality}>
        Quality
        <span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            id="quality"
            value={qualityDial}
            onChange={handleQualityChange}
          />
        </span>
      </label>
      <div className={styles.FileUploadMessageContainer}>
        {error && <div className={styles.FileUploadError}>{error}</div>}
        {isCompressing && (
          <div className={styles.FileUploadCompressing}>Compressing...</div>
        )}
      </div>

      {showBeforeAndAfter && (
        <BeforeAndAfter files={files} compressedFiles={compressedFiles} />
      )}
    </div>
  )
}

export { FileUpload }
