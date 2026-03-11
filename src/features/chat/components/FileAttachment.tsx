import { FileIcon, Download } from 'lucide-react';
import { Button } from '@shared/components/ui/button';
import type { MessageAttachment } from '../types/chat.types';

interface FileAttachmentProps {
  attachment: MessageAttachment;
}

/**
 * File attachment component
 *
 * Features:
 * - Image preview for image files
 * - Download link for other files (PDFs, etc.)
 * - File size display
 * - Thumbnail support
 *
 * Usage:
 * ```tsx
 * <FileAttachment attachment={attachment} />
 * ```
 */
export function FileAttachment({ attachment }: FileAttachmentProps) {
  const isImage = attachment.fileType.startsWith('image/');

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (isImage) {
    return (
      <div className="mt-2">
        <a
          href={attachment.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={attachment.thumbnailUrl || attachment.fileUrl}
            alt={attachment.fileName}
            className="max-w-xs rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          />
        </a>
        <div className="mt-1 text-xs opacity-70">
          {attachment.fileName} • {formatFileSize(attachment.fileSize)}
        </div>
      </div>
    );
  }

  // Non-image files (PDF, documents, etc.)
  return (
    <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background p-3">
      <FileIcon className="h-6 w-6 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <div className="truncate text-sm font-medium">{attachment.fileName}</div>
        <div className="text-xs text-muted-foreground">
          {formatFileSize(attachment.fileSize)}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        asChild
      >
        <a
          href={attachment.fileUrl}
          download={attachment.fileName}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download className="h-4 w-4" />
        </a>
      </Button>
    </div>
  );
}
