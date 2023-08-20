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

export const getError = (message, model = null) => {
  return {
    status: "Error",
    message: message,
    model,
  };
};

export const isSuccess = (result) => result.status === "OK";
export const isError = (result) => result.status !== "OK";
