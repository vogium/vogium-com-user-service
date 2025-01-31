import { Type } from "class-transformer";
import { IsString, IsPositive, IsNumber, ValidateNested, IsArray } from "class-validator";
import { InteractionTrendDTO } from "./create-interaction-trend.dto";

export class UserStatsDTO {
    @IsString()
    private _userId: string;
  
    @IsPositive()
    private _dailyInteractions: number;
  
    @IsPositive()
    private _vogCount: number;
  
    @IsPositive()
    private _vogLikeCount: number;
  
    @IsPositive()
    private _postCommentCount: number;
  
    @IsNumber({ maxDecimalPlaces: 2 })
    private _engagementRate: number;
  
    @ValidateNested()
    @Type(() => InteractionTrendDTO)
    private _interactionTrend: InteractionTrendDTO;
  
    @IsArray()
    @IsString({ each: true })
    private _favoriteCategories: string[];
  
    constructor(
      userId: string,
      dailyInteractions: number,
      vogCount: number,
      vogLikeCount: number,
      postCommentCount: number,
      engagementRate: number,
      interactionTrend: InteractionTrendDTO,
      favoriteCategories: string[],
    ) {
      this._userId = userId;
      this._dailyInteractions = dailyInteractions;
      this._vogCount = vogCount;
      this._vogLikeCount = vogLikeCount;
      this._postCommentCount = postCommentCount;
      this._engagementRate = engagementRate;
      this._interactionTrend = interactionTrend;
      this._favoriteCategories = favoriteCategories;
    }
  
    // Getter methods
    public get userId(): string {
      return this._userId;
    }
  
    public get dailyInteractions(): number {
      return this._dailyInteractions;
    }
  
    public get vogCount(): number {
      return this._vogCount;
    }
  
    public get vogLikeCount(): number {
      return this._vogLikeCount;
    }
  
    public get postCommentCount(): number {
      return this._postCommentCount;
    }
  
    public get engagementRate(): number {
      return this._engagementRate;
    }
  
    public get interactionTrend(): InteractionTrendDTO {
      return this._interactionTrend;
    }
  
    public get favoriteCategories(): string[] {
      return this._favoriteCategories;
    }
  }