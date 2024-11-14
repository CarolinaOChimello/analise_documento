import React, { useState, useEffect } from "react";
import styles from "./file-viewer.module.css";
import { BlobServiceClient } from '@azure/storage-blob';

const FileViewer = () => {
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {

    const interval = setInterval(() => {
      fetchFiles();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchFiles = async () => {
    const resp = await fetch("/api/assistants/files", {
      method: "GET",
    });
    const data = await resp.json();
    setFiles(data);
  };

  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    const maxSize = 20 * 1024 * 1024; // 20 MB em bytes

    if (file && file.size > maxSize) {
      setErrorMessage('O arquivo é muito grande. O tamanho máximo permitido é de 20 MB.');
      return;
    }

    if (event.target.files.length < 0) return;
        
      const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
      const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
      const containerName = 'your-container-name';

      const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${accountKey}`);
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(file.name);

      try {
        const uploadBlobResponse = await blockBlobClient.uploadFile(file.data);
        //return event.status(200).json({ message: 'Upload successful', uploadBlobResponse });
        return;
      } catch (error) {
        //return event.status(500).json({ message: 'Upload failed', error });
        return;
      } 
  };

  return (
    <div className={styles.fileViewer}>
      <div
        className={`${styles.filesList} ${files.length !== 0 ? styles.grow : ""}`}
    >
          <div className={styles.title}>Anexe os arquivos aqui   <div className={styles.supportedFormats}>
            Formatos suportados: docx, xlsx, pdf e txt
          </div> </div>
      
      </div>
      <div className={styles.fileUploadContainer}>
        <label htmlFor="file-upload" className={styles.fileUploadBtn}>
          Anexar
        </label>
        <input
          type="file"
          id="file-upload"
          name="file-upload"
          className={styles.fileUploadInput}
          multiple
          onChange={handleFileUpload}
        />
      </div>
      {errorMessage && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default FileViewer;