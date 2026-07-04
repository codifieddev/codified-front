const fs = require('fs');
const path = require('path');

const API_ENDPOINT = 'https://kalptree.xyz/api/platform/business-blueprint';
const TENANT_HEADER = 'kp_codified_web_solution';

// Map globle_kalp.css variable names to API blueprint color keys
const VAR_MAP = {
  '--primary': 'primary',
  '--primary-light': 'primaryLight',
  '--primary-dark': 'primaryDark',
  '--primary-hover': 'primaryHover',
  '--secondary': 'secondary',
  '--accent': 'accent',
  '--violet': 'violet',
  '--background': 'background',
  '--surface': 'surface',
  '--card': 'card',
  '--text': 'text',
  '--text-secondary': 'textSecondary',
  '--text-muted': 'textMuted',
  '--border': 'border',
  '--border-hover': 'borderHover',
  '--success': 'success',
  '--warning': 'warning',
  '--danger': 'danger',
  '--info': 'info'
};

async function syncTheme() {
  // 1. Read local globle_kalp.css
  const cssPath = path.join(__dirname, '../src/styles/globle_kalp.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  
  // Extract CSS variables using regex
  const localColors = {};
  for (const [cssVar, apiKey] of Object.entries(VAR_MAP)) {
    const regex = new RegExp(`${cssVar}\\s*:\\s*([^;\\n]+)\\s*;`);
    const match = cssContent.match(regex);
    if (match) {
      localColors[apiKey] = match[1].trim();
    }
  }

  console.log("Extracted local colors from globle_kalp.css:", JSON.stringify(localColors, null, 2));

  // 2. Fetch current blueprint from platform API
  console.log("Fetching current blueprint from platform...");
  const getRes = await fetch(API_ENDPOINT, {
    headers: { 'x-tenant-db': TENANT_HEADER }
  });
  
  if (!getRes.ok) {
    throw new Error(`Failed to fetch blueprint: ${await getRes.text()}`);
  }
  
  const getJson = await getRes.json();
  const currentPayload = getJson.data.payload;

  // 3. Update public_theme and brandAssets.public_theme colors
  const updatedTheme = {
    ...currentPayload.public_theme,
    colors: {
      ...currentPayload.public_theme.colors,
      ...localColors
    }
  };

  const updatedPayload = {
    ...currentPayload,
    public_theme: updatedTheme,
    brandAssets: {
      ...currentPayload.brandAssets,
      public_theme: updatedTheme
    }
  };

  // 4. Send PUT request to update the blueprint
  console.log("Sending PUT request to update theme on platform...");
  const putRes = await fetch(API_ENDPOINT, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'accept': 'application/json',
      'x-tenant-db': TENANT_HEADER
    },
    body: JSON.stringify({ payload: updatedPayload })
  });

  if (!putRes.ok) {
    throw new Error(`Failed to update blueprint: ${await putRes.text()}`);
  }

  const putJson = await putRes.json();
  console.log("Successfully updated platform blueprint theme! Website colors synchronized.");
}

syncTheme().catch(console.error);
