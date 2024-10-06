export interface TenantChargeSeed {
  AppOfficeID: number;
  AllureLabor: string;
  AllureMaterial: number;
  AllureRemovalCost: string;
  AllureSKU: null;
  AllureSqFtPerSKU: string;
  AllureStoreNumber: string;
  AllureWasteFactor: null;
  CarpetLabor: string;
  CarpetMaterial: number;
  CarpetPadLabor: number;
  CarpetPadMaterial: number;
  CarpetPadSKU: null;
  CarpetPadSqYdPerSKU: string;
  CarpetPadStoreNumber: string;
  CarpetPadWasteFactor: null;
  CarpetRemovalCost: string;
  CarpetSKU: null;
  CarpetStoreNumber: string;
  CarpetWasteFactor: null;
  CeilingPaintFiveGallonColor: null;
  CeilingPaintFiveGallonLabor: string;
  CeilingPaintFiveGallonMaterial: number;
  CeilingPaintFiveGallonSKU: null;
  CeilingPaintFiveGallonSqFtSKU: string;
  CeilingPaintFiveGallonStoreNumber: string;
  Description: string;
  DisplayServiceType: number;
  DisplayTenantResponsibility: number;
  HardwoodLabor: string;
  HardwoodMaterial: number;
  HardwoodRemovalCost: string;
  HardwoodSKU: null;
  HardwoodSqFtPerSKU: string;
  HardwoodStoreNumber: string;
  HardwoodWasteFactor: null;
  HourlyLaborRate: string;
  LinoleumLabor: string;
  LinoleumMaterial: number;
  LinoleumRemovalCost: string;
  LinoleumSKU: null;
  LinoleumStoreNumber: string;
  LinoleumWasteFactor: null;
  Name: string;
  OfficeCode: null;
  PWFlowGroup: PWFlowGroup[];
  PWFlowID: string;
  TaxOnLabor: null;
  TaxOnMaterial: null;
  TaxRate: null;
  TileBackStoreNumber: string;
  TileBackerLabor: string;
  TileBackerMaterial: number;
  TileBackerSKU: null;
  TileBackerSqFtPerSKU: string;
  TileBackerWasteFactor: null;
  TileLabor: string;
  TileMaterial: number;
  TileMaterialSKU: null;
  TileRemovalCost: string;
  TileSqFtPerSKU: string;
  TileStoreNumber: string;
  TileWasteFactor: null;
  TrimPaintOneGallonColor: null;
  TrimPaintOneGallonLabor: string;
  TrimPaintOneGallonMaterial: number;
  TrimPaintOneGallonSKU: null;
  TrimPaintOneGallonSqFtSKU: string;
  TrimPaintOneGallonStoreNumber: string;
  WallPaintFiveGallonColor: null;
  WallPaintFiveGallonLabor: string;
  WallPaintFiveGallonMaterial: number;
  WallPaintFiveGallonSKU: null;
  WallPaintFiveGallonSqFtPerSKU: string;
  WallPaintFiveGallonStoreNumber: string;
  LastUpdatedBy: string;
  LastUpdatedDate: number;
}

export interface PWFlowGroup {
  PWFlowGroupID: number;
  PWGroupID: number;
  PWFlowID: number;
  DisplayOrder: number;
  BedroomGroup: number;
  BathroomGroup: number;
  PWGroupName: string;
  Comments: string;
  Description: string;
  GLCode: null;
  IncludeComment: number;
  IncludeMeasurements: number;
  IncludePaint: number;
  MaxNumberPerHouse: number;
  PhotoFolderName: null;
  DefaultPhotoGroup: number;
  Required: number;
  PWItem: PWItem[];
  GroupType: null;
}

export interface PWItem {
  crtSysusrId: SysusrID;
  crtTs: number;
  lastUpdSysusrId: SysusrID;
  customItemId: number;
  updatedByUserFirstName: UpdatedByUserFirstName;
  updatedByUserLastName: UpdatedByUserLastName;
  LastUpdatedDate: number;
  PWItemID: number;
  Required: number;
  DefaultMaterial: number;
  DefaultLabor: number;
  DefaultHours: number;
  GLCode: null | string;
  PictureRequired: number;
  ObjCClassName: ObjCClassName;
  PriceOverride: number;
  NonBugdetItem: number;
  Category: Category | null;
  SubCategory: null | string;
  DisplayOrder: number;
  Active: number;
  allowEdit: number;
  SalesforceItemId: null;
  MinPhotos: number;
  PhotoNotes: null;
  Name: string;
  AppOfficeID: number;
  OfficeCode: string;
  PercentBudget: number;
  ItemComment: ItemComment[];
  ItemSKU: ItemSKU[];
  MaterialRate: number;
  LaborRate: number;
  DisplayAllTheTime: number;
  LastUpdatedBy: LastUpdatedBy;
}

export enum Category {
  Electrical = 'Electrical',
  NonRecurring = 'Non Recurring',
  Painting = 'Painting',
  Plumbing = 'Plumbing',
  ValueAdd = 'Value Add',
}

export interface ItemComment {
  Comment: string;
  DisplayOrder: number;
  DefaultPrice: number;
}

export interface ItemSKU {
  PWItemSkuID: number;
  renoCpntId: number;
  SKU: string;
  Description: string;
  DefaultLabor: number;
  DefaultHours: number;
  GLCode: null | string;
  DisplayOrder: number;
  MultiPackSKU: null | string;
  MultiPackQty: number;
  DefaultQty: number;
  Price: number;
  DefaultStoreNumber: string;
  BrandName: null;
  ExternalSKU: null;
  NonProductSku: number;
  ItemName: null;
  TierName: string;
  ProductTierID: any[];
  ProductType: null;
  SKUImage: null;
  GroupName: null;
  AdditionalInfo: null;
  UOICd: null;
  ServiceRef: number;
  AmountNeeded: null;
  Qty: null;
}

export enum LastUpdatedBy {
  RichardGaston = 'Richard Gaston',
  RyanCard = 'Ryan Card',
  ThomasCorley = 'Thomas Corley',
}

export enum ObjCClassName {
  BasicComments = 'BasicComments',
  SingleSku = 'SingleSku',
}

export enum SysusrID {
  RcardMycommunityHo = 'rcard@mycommunity.ho',
  RgastonMycommunity = 'rgaston@mycommunity.',
  TcorleyMycommunity = 'tcorley@mycommunity.',
}

export enum UpdatedByUserFirstName {
  Richard = 'Richard',
  Ryan = 'Ryan',
  Thomas = 'Thomas',
}

export enum UpdatedByUserLastName {
  Card = 'Card',
  Corley = 'Corley',
  Gaston = 'Gaston',
}
