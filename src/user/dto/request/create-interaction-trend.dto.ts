import { IsDateString, IsNumber } from "class-validator";

export class InteractionTrendDTO {
    @IsDateString({}, { each: true })
    private _dates: string[];
  
    @IsNumber({}, { each: true })
    private _values: number[];
  
    constructor(dates: string[], values: number[]) {
      this._dates = dates;
      this._values = values;
    }
  
    public get dates(): string[] {
      return this._dates;
    }
  
    public get values(): number[] {
      return this._values;
    }
  }