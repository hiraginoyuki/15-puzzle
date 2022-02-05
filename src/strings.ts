export function insert(originalStr: string, insertedStr: string, index: number, overwrite = false) {
  return originalStr.slice(0, index) + insertedStr + originalStr.slice(index + insertedStr.length * +overwrite)
}

