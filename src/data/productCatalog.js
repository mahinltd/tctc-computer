const buildLogoDataUri = (label, background, textColor) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${background}"/><stop offset="100%" stop-color="${textColor}22"/></linearGradient></defs><rect width="200" height="200" rx="32" fill="url(#grad)"/><text x="50%" y="55%" text-anchor="middle" fill="${textColor}" font-family="'Segoe UI', 'Helvetica Neue', Arial" font-size="72" font-weight="700" letter-spacing="4">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const PRODUCT_LOGOS = {
  photoshop: { label: "Ps", gradient: ["#001E36", "#31A8FF"], dataUri: buildLogoDataUri("Ps", "#001E36", "#31A8FF") },
  illustrator: { label: "Ai", gradient: ["#330000", "#FF9A00"], dataUri: buildLogoDataUri("Ai", "#330000", "#FF9A00") },
  msword: { label: "W", gradient: ["#0B5FFF", "#9CC2FF"], dataUri: buildLogoDataUri("W", "#0B5FFF", "#E3F2FF") },
  excel: { label: "X", gradient: ["#0F5132", "#8FD19E"], dataUri: buildLogoDataUri("X", "#0F5132", "#AEFFCF") },
  powerpoint: { label: "P", gradient: ["#8A1A00", "#FFB295"], dataUri: buildLogoDataUri("P", "#8A1A00", "#FFD5C9") },
  autocad: { label: "AC", gradient: ["#2B2D42", "#EF233C"], dataUri: buildLogoDataUri("AC", "#2B2D42", "#EF233C") },
  graphics: { label: "GD", gradient: ["#1F2933", "#7C3AED"], dataUri: buildLogoDataUri("GD", "#1F2933", "#C084FC") },
  cv: { label: "CV", gradient: ["#0E7490", "#22D3EE"], dataUri: buildLogoDataUri("CV", "#0E7490", "#A5F3FC") },
  template: { label: "TP", gradient: ["#6D28D9", "#C084FC"], dataUri: buildLogoDataUri("TP", "#6D28D9", "#F5D0FE") },
  software: { label: "SW", gradient: ["#0F172A", "#22D3EE"], dataUri: buildLogoDataUri("SW", "#0F172A", "#22D3EE") },
  generic: { label: "DP", gradient: ["#111827", "#6B7280"], dataUri: buildLogoDataUri("DP", "#111827", "#9CA3AF") }
};

const preset = (overrides) => ({
  description: "Instant digital download after payment verification.",
  price: 350,
  type: "Software",
  ...overrides,
  thumbnailUrl: overrides.thumbnailUrl || PRODUCT_LOGOS[overrides.logoKey || "generic"].dataUri
});

export const PRODUCT_PRESETS = [
  preset({
    id: "photoshop",
    label: "Adobe Photoshop 2024",
    title: "Adobe Photoshop 2024",
    logoKey: "photoshop",
    price: 550,
    type: "Software"
  }),
  preset({
    id: "illustrator",
    label: "Adobe Illustrator 2024",
    title: "Adobe Illustrator 2024",
    logoKey: "illustrator",
    price: 550,
    type: "Software"
  }),
  preset({
    id: "msword",
    label: "Microsoft Word Templates",
    title: "Microsoft Word Professional Templates",
    logoKey: "msword",
    price: 250,
    type: "Doc"
  }),
  preset({
    id: "excel",
    label: "Microsoft Excel Automation Sheets",
    title: "Excel Accounting & Inventory Sheets",
    logoKey: "excel",
    price: 300,
    type: "Doc"
  }),
  preset({
    id: "powerpoint",
    label: "PowerPoint Presentation Pack",
    title: "PowerPoint Presentation Pack",
    logoKey: "powerpoint",
    price: 280,
    type: "Template"
  }),
  preset({
    id: "autocad",
    label: "AutoCAD Project Bundle",
    title: "AutoCAD 2D/3D Project Bundle",
    logoKey: "autocad",
    price: 450,
    type: "Software"
  }),
  preset({
    id: "graphics",
    label: "Graphics Design Resource Pack",
    title: "Graphics Design Resource Pack",
    logoKey: "graphics",
    price: 320,
    type: "AI"
  }),
  preset({
    id: "cv",
    label: "ATS Proof CV Templates",
    title: "ATS Proof CV & Cover Letter Templates",
    logoKey: "cv",
    price: 180,
    type: "Doc"
  }),
  preset({
    id: "template",
    label: "Freelancing Gig Templates",
    title: "Freelancing Gig Template Kit",
    logoKey: "template",
    price: 220,
    type: "Template"
  })
];

export const getPresetById = (id) => PRODUCT_PRESETS.find((presetItem) => presetItem.id === id);
