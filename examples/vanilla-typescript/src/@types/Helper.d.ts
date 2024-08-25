import { Properties } from "./Properties";

declare class Helper {
  private random;
  private props?;

  constructor(props?: Properties);

  getRandom(): number;

  getProjectName(): string;
}

export default Helper;
