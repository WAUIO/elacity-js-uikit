/* eslint-disable no-extra-boolean-cast */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  useCallback, useState, useEffect, CSSProperties,
} from 'react';
import {
  useDropzone, DropzoneOptions, FileRejection,
} from 'react-dropzone';
import Box from '@mui/material/Box';
import { SxProps } from '@mui/system';
import MediaViewer, { FileType } from './MediaViewer';

// ATTENTION: .accept props from Dropzone has changed to object instead
// of string since #issue-276
export interface UploadProps extends DropzoneOptions {
  onDropped: (acceptedFiles: any) => void;
  onRejected?: (rejectedFiles: FileRejection[]) => void;
  sx?: SxProps;
  supportedFileDescription?: string;
  previewStyle?: CSSProperties;
}

const Upload: React.FC<React.PropsWithChildren<UploadProps>> = ({
  onDropped,
  onRejected,
  children,
  sx,
  supportedFileDescription,
  ...dropzoneProps
}) => {
  const onDrop = useCallback(onDropped, []);
  const onDropRejected = useCallback((rejectedFiles: FileRejection[]) => {
    console.log('[onDropRejected]', rejectedFiles);
    onRejected(rejectedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    maxSize: 20 * 1024 * 1024,
    ...dropzoneProps,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{ borderRadius: 2, border: '3px dotted #aaa', p: 3, mt: 3, ...sx }}
      className="hoverable"
    >
      <input {...getInputProps()} />
      {!children &&
        (isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div
            style={{
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <span>Drag and drop some files here, or click to select files</span>
            <span style={{ fontWeight: 'bolder' }}>{supportedFileDescription}</span>
          </div>
        ))}
      {children && children}
    </Box>
  );
};

Upload.defaultProps = {
  // eslint-disable-next-line react/default-props-match-prop-types
  accept: {
    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp']
  },
  supportedFileDescription: 'JPG, PNG, BMP, GIF Max 20Mb',
};

export interface InlineUploaderProps extends Omit<UploadProps, 'onDropped'> {
  initialValue?: any;
  sx?: any;
  hideName?: boolean;
  onDropped: (acceptedFile: File) => void;
  onMimeTypeAcquired?: (mimeType: string) => void;
}

interface FilePreview {
  src: string;
  type?: FileType;
  mimeType?: string;
}

const Inline: React.FC<React.PropsWithChildren<InlineUploaderProps>> = ({
  hideName,
  onDropped,
  onMimeTypeAcquired,
  initialValue,
  sx,
  children,
  previewStyle,
  accept,
  ...props
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState<FilePreview>({
    src: '',
  });

  useEffect(() => {
    onMimeTypeAcquired?.(preview.mimeType);
  }, [preview.mimeType]);

  useEffect(() => {
    if (initialValue) {
      setFile(initialValue);
    }
  }, []);

  useEffect(() => () => {
    if (file !== null) {
      URL.revokeObjectURL(file);
    }
  });

  const handleDropped = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // console.log('[Upload.handleDropped]', acceptedFiles[0]);
      setFile(acceptedFiles[0]);

      const guessMimeType = (suggestedMimeType: string) => {
        // this function will try to resolve the mime type by what has been given
        // as argument but when it's too generic, we will try to use the extension instead
        const extension = acceptedFiles[0].name.split('.').pop();
        if (['application/octet-stream'].includes(suggestedMimeType)) {
          // use extension to determine mimetype (not really safe)
          switch (extension) {
            case 'glb':
            case 'gltf':
              return 'model/gltf-binary';
            case 'obj':
              return 'model/obj';
            case 'fbx':
            default:
              return 'application/octet-stream';
          }
        }

        return suggestedMimeType;
      };

      if (acceptedFiles[0].type?.match('image')) {
        setPreview({
          src: URL.createObjectURL(acceptedFiles[0]),
          type: 'image',
          mimeType: acceptedFiles[0].type,
        });
      } else if (acceptedFiles[0].type?.match('video')) {
        setPreview({
          src: URL.createObjectURL(acceptedFiles[0]),
          type: 'video',
          mimeType: acceptedFiles[0].type,
        });
      } else if (acceptedFiles[0].type === '') {
        // try to resolve with FileReader  extension
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setPreview({
            src: URL.createObjectURL(acceptedFiles[0]),
            type: '3d',
            mimeType: guessMimeType(String(e.target.result).split(';base64,').shift().replace(/^data:/gi, '')),
          });
        };
        reader.readAsDataURL(acceptedFiles[0]);
      } else {
        setPreview({
          src: URL.createObjectURL(acceptedFiles[0]),
          type: '3d',
          mimeType: guessMimeType(acceptedFiles[0].type),
        });
      }

      if (onDropped) {
        onDropped(acceptedFiles[0]);
      }
    } else {
      setFile(null);
      setPreview({
        src: '',
      });
    }
  };

  return (
    <>
      <Upload
        onDropped={handleDropped}
        maxFiles={1}
        accept={accept}
        sx={sx}
        {...props}
      >
        {
          Boolean(children)
            ? children
            : preview.src !== '' && (
              <MediaViewer.Preview
                src={preview.src}
                mode="preview"
                type={preview.type}
                mimeType={preview.mimeType}
                style={{
                  width: '100%',
                  height: 'auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  boxShadow: 'none',
                }}
              />
            )
        }
      </Upload>
      {!hideName && file !== null && <p style={{ textAlign: 'center', fontSize: '0.8rem' }}>{file.name}</p>}
    </>
  );
};

export default {
  Base: Upload,
  Inline,
};
