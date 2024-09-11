declare interface TypeSave {
  savePath: string;
  minZoom: number;
  maxZoom: number;
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
}
