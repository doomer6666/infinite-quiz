import { Expose } from "class-transformer";

export class PublicUserRdo {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatar!: string;
}
