const getResult = (id, text) => {
  return {
    status: "NOTSET",
    text: text,
    id: id,
  };
};

export const getSuccess = (id, text) => {
  const resultModel = getResult(id, text);
  resultModel.status = "OK";
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
