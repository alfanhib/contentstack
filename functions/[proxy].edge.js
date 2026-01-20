import Personalize from '@contentstack/personalize-edge-sdk';

/**
 * Contentstack Launch Edge Proxy
 *
 * This edge function runs before requests reach the Next.js app.
 * It initializes the Personalize SDK and passes variant parameters via URL query string.
 *
 * @see https://www.contentstack.com/docs/personalize/setup-nextjs-website-with-personalize-launch
 */

/**
 * Map ISO country codes to full country names
 * Used to match Contentstack Personalize audience rules
 */
const COUNTRY_NAMES = {
  ID: 'Indonesia',
  US: 'United States',
  GB: 'United Kingdom',
  AU: 'Australia',
  SG: 'Singapore',
  MY: 'Malaysia',
  JP: 'Japan',
  DE: 'Germany',
  FR: 'France',
  NL: 'Netherlands',
  TH: 'Thailand',
  VN: 'Vietnam',
  PH: 'Philippines',
  IN: 'India',
  CN: 'China',
  KR: 'South Korea',
  HK: 'Hong Kong',
  TW: 'Taiwan',
  NZ: 'New Zealand',
  CA: 'Canada',
};

/**
 * Detect device type from User-Agent
 */
function getDeviceType(userAgent) {
  if (!userAgent) return 'Desktop';
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|windows phone/i.test(ua)) {
    return 'Mobile';
  }
  if (/ipad|tablet/i.test(ua)) {
    return 'Tablet';
  }
  return 'Desktop';
}

/**
 * Detect operating system from User-Agent
 */
function getOperatingSystem(userAgent) {
  if (!userAgent) return 'Unknown';
  const ua = userAgent.toLowerCase();
  if (/macintosh|mac os x/i.test(ua)) return 'MacOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/linux/i.test(ua)) return 'Linux';
  if (/iphone|ipad|ipod/i.test(ua)) return 'iOS';
  if (/android/i.test(ua)) return 'Android';
  return 'Unknown';
}

/**
 * Get country from various sources
 */
function getCountryName(request, parsedUrl) {
  // 1. Check query param for testing (?_country=Indonesia or ?_country=ID)
  const testCountry = parsedUrl.searchParams.get('_country');
  if (testCountry) {
    const countryName = COUNTRY_NAMES[testCountry.toUpperCase()] || testCountry;
    return countryName;
  }

  // 2. Cloudflare headers (Launch uses Cloudflare)
  const cfCountry = request.headers.get('cf-ipcountry');
  if (cfCountry && cfCountry !== 'XX') {
    const countryName = COUNTRY_NAMES[cfCountry] || cfCountry;
    return countryName;
  }

  // 3. Vercel geo headers (if deployed on Vercel)
  const vercelCountry = request.headers.get('x-vercel-ip-country');
  if (vercelCountry) {
    const countryName = COUNTRY_NAMES[vercelCountry] || vercelCountry;
    return countryName;
  }

  return undefined;
}

/**
 * Launch Edge Proxy Handler
 */
export default async function handler(request, context) {
  const parsedUrl = new URL(request.url);
  const pathname = parsedUrl.pathname;

  // Exclude Next.js asset calls and static files - only process page requests
  if (
    ['_next', 'favicon.ico', 'api'].some((path) => pathname.includes(path)) ||
    /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot)$/i.test(pathname)
  ) {
    return fetch(request);
  }

  try {
    // Set a custom edge API URL if configured (for different Contentstack regions)
    if (context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
      Personalize.setEdgeApiUrl(context.env.NEXT_PUBLIC_CONTENTSTACK_PERSONALIZE_EDGE_API_URL);
    }

    // Initialize the SDK and pass the request
    const personalizeSdk = await Personalize.init(
      context.env.NEXT_PUBLIC_PERSONALIZE_PROJECT_UID,
      { request }
    );

    // Check if we need to reset (when testing with ?_reset=1)
    const shouldReset = parsedUrl.searchParams.get('_reset') === '1';
    if (shouldReset && personalizeSdk.reset) {
      personalizeSdk.reset();
    }

    // Get User-Agent for device/OS detection
    const userAgent = request.headers.get('user-agent') || '';
    const deviceType = getDeviceType(userAgent);
    const operatingSystem = getOperatingSystem(userAgent);
    const countryName = getCountryName(request, parsedUrl);

    // Set attributes to match audience rules
    // IMPORTANT: Attribute names must match exactly what's configured in Contentstack Personalize
    const attributes = {};
    if (countryName) {
      attributes['Country'] = countryName;
    }
    attributes['Device Type'] = deviceType;
    attributes['Operating System'] = operatingSystem;

    // Set all attributes
    personalizeSdk.set(attributes);

    // Get the variant parameter from the SDK
    const variantParam = personalizeSdk.getVariantParam();

    // Set the variant parameter as a query param in the URL
    if (variantParam) {
      parsedUrl.searchParams.set(Personalize.VARIANT_QUERY_PARAM, variantParam);
    }

    // Remove test params before forwarding (optional - keeps URL clean)
    parsedUrl.searchParams.delete('_country');
    parsedUrl.searchParams.delete('_reset');

    // Rewrite the request with the modified URL
    const modifiedRequest = new Request(parsedUrl.toString(), request);
    const response = await fetch(modifiedRequest);

    // Create a modified response
    const modifiedResponse = new Response(response.body, response);

    // Add cookies to the response (for user identification on next request)
    await personalizeSdk.addStateToResponse(modifiedResponse);

    // Ensure that the response is not cached on the browser for personalized content
    modifiedResponse.headers.set('cache-control', 'no-store, must-revalidate');

    // Add debug headers (optional - can be removed in production)
    if (variantParam) {
      modifiedResponse.headers.set('x-personalize-variant', variantParam);
    }
    modifiedResponse.headers.set('x-personalize-attributes', JSON.stringify(attributes));

    return modifiedResponse;
  } catch {
    // Continue without personalization if there's an error
    return fetch(request);
  }
}
