export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface PlaceLocation extends Coordinates {
    address: string | null; // Allow null
    staticMapImageUrl: string | null; // Allow null
  }
  