export default interface Comments {
  readonly postId: number;
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly body: string;
  random: number;
  uniqId: string;
}
