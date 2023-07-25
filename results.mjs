const getResult = (id, text) => {
  return {
    status: "OK",
    text: text,
    id: id,
  };
};

export const getSuccess = (audioFileName, id, text, sdkResultId) => {
  const resultModel = getResult(audioFileName, id, text);
  resultModel.status = "OK";
  resultModel.speechId = sdkResultId;
  return resultModel;
};

export const getFailure = (id, text) => {
  const resultModel = getResult(null, id, text);
  resultModel.status = "Error";
  return resultModel;
};

export const getError = (message) => {
  return {
    status: "Error",
    message: message,
  };
};
