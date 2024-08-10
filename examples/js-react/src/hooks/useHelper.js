const useHelper = (props) => {
  const getRandom = () => {
    return Math.random() * 1000;
  }

  const getProjectName = () => {
    return props?.name;
  }

  return {
    getRandom,
    getProjectName,
  }
}

export default useHelper;
