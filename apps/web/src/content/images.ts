/** Ảnh render nội thất — public/images/space. Alt text: dict.images[key]. */
export const spaceImages = {
  reception: { key: "reception", src: "/images/space/space-01-reception.jpg", w: 1600, h: 1066 },
  floor: { key: "floor", src: "/images/space/space-02-floor.jpg", w: 1600, h: 1066 },
  chair: { key: "chair", src: "/images/space/space-03-chair.jpg", w: 1600, h: 1066 },
  washCorner: {
    key: "washCorner",
    src: "/images/space/space-04-wash-corner.jpg",
    w: 1600,
    h: 1066,
  },
  washLounge: {
    key: "washLounge",
    src: "/images/space/space-05-wash-lounge.jpg",
    w: 1600,
    h: 1066,
  },
  lounge: { key: "lounge", src: "/images/space/space-06-lounge.jpg", w: 1600, h: 900 },
  stations: { key: "stations", src: "/images/space/space-07-stations.jpg", w: 1600, h: 900 },
  overview: { key: "overview", src: "/images/space/space-08-overview.jpg", w: 1600, h: 900 },
} as const;

export type SpaceImage = (typeof spaceImages)[keyof typeof spaceImages];
export type ImageKey = SpaceImage["key"];
