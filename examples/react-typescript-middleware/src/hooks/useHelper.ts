import uniqId from 'uniqid';
import { Properties } from "../@types";

const useHelper = (props?: Properties) => {
  const getRandom: () => number = () => {
    return Math.random() * 1000;
  }

  const getProjectName: () => string | undefined = () => {
    return props?.name;
  }

  const getUniqId: () => string = () => {
    return uniqId();
  }

  return {
    getRandom,
    getProjectName,
    getUniqId,
  }
}

export default useHelper;
