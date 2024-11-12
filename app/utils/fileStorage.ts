// Simular um banco de dados em memória
let fileDatabase: { [key: string]: any[] } = {};

// Função para adicionar arquivos
const addFile = (threadId: string, file: any) => {
  if (!fileDatabase[threadId]) {
    fileDatabase[threadId] = [];
  }
  fileDatabase[threadId].push(file);
};

// Função para obter arquivos por threadId
const getFilesByThreadId = (threadId: string) => {
  return fileDatabase[threadId] || [];
};

export { addFile, getFilesByThreadId };