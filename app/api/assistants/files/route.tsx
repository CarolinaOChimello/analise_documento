import { assistantId } from "@/app/assistant-config";
import { openai } from "@/app/openai";
import { BlobServiceClient } from '@azure/storage-blob'

// upload file to assistant's vector store
export async function POST(request) {

  const formData = await request.formData(); // process file as FormData
  const file = formData.get("file"); // retrieve the single file from FormData
  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store

  // upload using the file stream
  const openaiFile = await openai.files.create({
    file: file,
    purpose: "assistants",
  });

  // add file to vector store
  await openai.beta.vectorStores.files.create(vectorStoreId, {
    file_id: openaiFile.id,
  });

  //try {
  //const blobServiceClient = new BlobServiceClient(`https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/?${process.env.AZURE_STORAGE_ACCOUNT_KEY}`);
  //const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
  //const blockBlobClient = containerClient.getBlockBlobClient(openaiFile.id);
  //const uploadBlobResponse = await blockBlobClient.uploadFile(file.stream());
  //} catch (error) {
  //  console.error("Error post blob:", error);
  //  return new Response("Error post file", { status: 500 });
  // }

  return new Response();
}

// list files in assistant's vector store
export async function GET() {

  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
  const fileList = await openai.beta.vectorStores.files.list(vectorStoreId);

  const filesArray = await Promise.all(
    fileList.data.map(async (file) => {
      const fileDetails = await openai.files.retrieve(file.id);
      const vectorFileDetails = await openai.beta.vectorStores.files.retrieve(
        vectorStoreId,
        file.id
      );
      return {
        file_id: file.id,
        filename: fileDetails.filename,
        status: vectorFileDetails.status,
      };
    })
  );

  //try {
  //const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  //const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);

  // let blobList = [];
  // for await (const blob of containerClient.listBlobsFlat()) {
  // blobList.push({ name: blob.name, url: `${containerClient.url}/${blob.name}` });
  // }
  //return Response.json(blobList);
  //} catch (error) {
  //  console.error("Error get blob:", error);
  //  return new Response("Error get file", { status: 500 });
  // }

  return Response.json(filesArray);
}

// delete file from assistant's vector store
export async function DELETE(request) {
  const body = await request.json();
  const fileId = body.fileId;

  const vectorStoreId = await getOrCreateVectorStore(); // get or create vector store
  await openai.beta.vectorStores.files.del(vectorStoreId, fileId); // delete file from vector store

  //try {
  //const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
  //const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME);
  //const blockBlobClient = containerClient.getBlockBlobClient(openaiFile.id);
  //await blockBlobClient.delete();
  //} catch (error) {
  //  console.error("Error deleting blob:", error);
  //  return new Response("Error deleting file", { status: 500 });
  //}

  return new Response();
}

/* Helper functions */

const getOrCreateVectorStore = async () => {
  const assistant = await openai.beta.assistants.retrieve(assistantId);

  // if the assistant already has a vector store, return it
  if (assistant.tool_resources?.file_search?.vector_store_ids?.length > 0) {
    return assistant.tool_resources.file_search.vector_store_ids[0];
  }
  // otherwise, create a new vector store and attatch it to the assistant
  const vectorStore = await openai.beta.vectorStores.create({
    name: "sample-assistant-vector-store",
    expires_after: null, 
  });
  await openai.beta.assistants.update(assistantId, {
    tool_resources: {
      file_search: {
        vector_store_ids: [vectorStore.id],
      },
    },
  });
  return vectorStore.id;
};