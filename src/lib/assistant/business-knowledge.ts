export const PRIMARY_MOUNTING_PRICE = 89;
export const RACEWAY_PRICE = 25;
export const IN_WALL_CONCEALMENT = { min: 65, max: 85 };

export const WALL_TYPES = [
  "drywall",
  "metal-studs",
  "plaster",
  "brick",
  "concrete",
  "tile",
  "stone",
  "marble",
  "decorative-panels",
  "specialty",
  "unknown",
] as const;

export const CUSTOM_WALL_DETAILS: Record<
  Exclude<(typeof WALL_TYPES)[number], "drywall">,
  { reason: string; photos: string[] }
> = {
  "metal-studs": {
    reason: "Metal studs require photo review to confirm a safe mounting approach.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  plaster: {
    reason: "Plaster walls require photo review to confirm wall condition and anchoring.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  brick: {
    reason: "Brick walls require photo review to confirm anchors and the mounting approach.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  concrete: {
    reason: "Concrete walls require photo review to confirm anchors and the mounting approach.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  tile: {
    reason: "Tile walls require photo review to assess the surface before mounting.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  stone: {
    reason: "Stone walls require photo review to assess the surface before mounting.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  marble: {
    reason: "Marble walls require photo review to assess the surface before mounting.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  "decorative-panels": {
    reason: "Decorative wall panels require photo review to confirm the mounting approach.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  specialty: {
    reason: "Specialty walls require photo review before we can provide a reliable estimate.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
  unknown: {
    reason: "An unknown wall type requires photo review before we can provide a reliable estimate.",
    photos: ["Full wall photo", "Close-up wall-surface photo", "Desired mounting area photo", "Outlet location photo"],
  },
};

export const FIREPLACE_PHOTOS = [
  "Full wall photo",
  "Fireplace and mantel photo",
  "Outlet location photo",
  "TV model label photo",
  "Desired mounting area photo",
];

export const FRAME_TV_PHOTOS = [
  "Full wall photo",
  "One Connect Box photo",
  "Outlet location photo",
  "Recessed-box area photo",
  "Desired mounting area photo",
];

export const LARGE_TV_PHOTOS = [
  "Full wall photo",
  "TV model label photo",
  "Desired mounting area photo",
  "Outlet location photo",
];

export const ELECTRICAL_SAFETY_NOTE =
  "In-wall concealment is priced for low-voltage cable routing only. Electrical outlet work is not included.";
