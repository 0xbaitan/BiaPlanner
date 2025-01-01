import { ICreateProductDto, IUpdateProductDto, Volumes, Weights } from "../../types";

export class CreateProductDto implements ICreateProductDto {
  name: string;
  brandId?: string | undefined;
  canExpire?: boolean | undefined;
  canQuicklyExpireAfterOpening?: boolean | undefined;
  millisecondsToExpiryAfterOpening?: number | undefined;
  numberOfServingsOrPieces?: number | undefined;
  useMeasurementMetric?: "weight" | "volume" | undefined;
  volumePerContainerOrPacket?: number | undefined;
  volumeUnit?: Volumes | undefined;
  weightPerContainerOrPacket?: number | undefined;
  weightUnit?: Weights | undefined;
  createdById?: string | undefined;
  isLoose?: boolean | undefined;
  productCategoryIds?: string[] | undefined;
}

export class UpdateProductDto implements IUpdateProductDto {
  brandId?: string | undefined;
  canExpire?: boolean | undefined;
  canQuicklyExpireAfterOpening?: boolean | undefined;
  millisecondsToExpiryAfterOpening?: number | undefined;
  name?: string | undefined;
  numberOfServingsOrPieces?: number | undefined;
  createdById?: string | undefined;
  useMeasurementMetric?: "weight" | "volume" | undefined;
  volumePerContainerOrPacket?: number | undefined;
  volumeUnit?: Volumes | undefined;
  weightPerContainerOrPacket?: number | undefined;
  weightUnit?: Weights | undefined;
  isLoose?: boolean | undefined;
  productCategoryIds?: string[] | undefined;
}
