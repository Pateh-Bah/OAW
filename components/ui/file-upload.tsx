import React, { useRef } from 'react'
import { Button } from './button'

interface FileUploadProps {
  onFileSelect: (file: File | null) => void
  accept?: string
  children: React.ReactNode
  className?: string
  disabled?: boolean
  id: string
  label: string
}

export function FileUpload({
  onFileSelect,
  accept = "image/*",
  children,
  className,
  disabled = false,
  id,
  label
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onFileSelect(file)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        disabled={disabled}
        id={id}
        aria-label={label}
        title={label}
      />
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className={className}
        aria-describedby={`${id}-description`}
      >
        {children}
      </Button>
      <div id={`${id}-description`} className="sr-only">
        {label}
      </div>
    </>
  )
}
