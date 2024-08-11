import { Properties } from "../@types";

const useFetch = (props?: Properties) => {
  const getRandom: () => number = () => {
    return Math.random() * 1000;
  }

  const getProjectName: () => string | undefined = () => {
    return props?.name;
  }

  return {
    getRandom,
    getProjectName,
  }
}

export default useFetch;
