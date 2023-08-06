const getResult = (model) => {
  return {
    status: "NOTSET",
    model,
  };
};

export const getSuccess = (model) => {
  const resultModel = getResult(model);
  resultModel.status = "OK";
  return resultModel;
};

export const getFailure = (model) => {
  const resultModel = getResult(model);
  resultModel.status = "Error";
  return resultModel;
};

export const getError = (message) => {
  return {
    status: "Error",
    message: message,
    model: null,
  };
};
