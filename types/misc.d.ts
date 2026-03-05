/** Type declarations for modules without or with mismatched @types */
declare module 'pdf-parse' {
  function pdfParse(
    dataBuffer: Buffer,
    options?: { pwd?: string; max?: number; version?: string }
  ): Promise<{ numpages: number; numrender: number; info: object; metadata: object; text: string; version: string }>
  export default pdfParse
}

declare module 'formidable' {
  export interface File {
    filepath: string
    originalFilename?: string | null
    newFilename?: string
    mimetype?: string | null
    size: number
  }
  function formidable(opts?: object): {
    parse(req: object): Promise<[Record<string, string[] | undefined>, Record<string, File | File[] | undefined>]>
  }
  export default formidable
}
