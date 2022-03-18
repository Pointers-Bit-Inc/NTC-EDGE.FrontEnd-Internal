import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';

const useDocumentPicker = () => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentResult | object>({});
  
  const pickDocument = async () => {
    let result:any = await DocumentPicker.getDocumentAsync({
      type: [
        'application/msword',
        'application/pdf',
        'application/vnd.ms-excel',
        'application/vnd.ms-powerpoint',
        'application/vnd.oasis.opendocument.text',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'text/csv',
      ],
      multiple: true,
      copyToCacheDirectory: true
    });
    if (result.type === 'success') {
      setSelectedFile(result)
    }
  }

  return {
    selectedFile,
    pickDocument,
  };
}

export default useDocumentPicker;