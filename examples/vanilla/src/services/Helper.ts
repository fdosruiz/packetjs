class Helper {
  private random: number;
  private props?: any;

  constructor(props?: any) {
    this.random = 0;
    this.props = props;
  }

  public getRandom() {
    this.random = Math.random() * 1000;
    return this.random;
  }

  public getProjectName() {
    return this.props?.name;
  }
}

export default Helper;
