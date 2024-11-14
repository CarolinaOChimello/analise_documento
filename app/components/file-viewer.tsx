import React, { useState, useEffect } from "react";
import styles from "./file-viewer.module.css";
import { BlobServiceClient } from '@azure/storage-blob'

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
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
  
    let blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }
  
    setFiles(blobs);
  };
  
  const handleFileUpload = async (event) => {

    const file = event.target.files[0];
    const maxSize = 20 * 1024 * 1024; // 20 MB em bytes

    if (file && file.size > maxSize) {
      setErrorMessage('O arquivo é muito grande. O tamanho máximo permitido é de 20 MB.');
      return;
    }

    if (event.target.files.length < 0) return;
        
      const blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${process.env.AZURE_STORAGE_ACCOUNT_KEY}`);
      const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
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
      <div className={`${styles.filesList} ${files.length !== 0 ? styles.grow : ""}`}>

        {files.length === 0 ? (
          <div className={styles.title}>Anexe os arquivos aqui   <div className={styles.supportedFormats}>
           Formatos suportados: docx, xlsx, pdf e txt
        </div> </div>
        ) : (
          files.map((file) => (
            <div key={file.file_id} className={styles.fileEntry}>
              <div className={styles.fileName}>
                <span className={styles.fileName}>{file.filename}</span>
                <span className={styles.fileStatus}>{file.status}</span>
              </div>
            </div>
          ))
        )}
      
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