export const categories = [
  { slug: 'logos', name: 'LOGOS', label: 'Logos' },
  { slug: 'names', name: 'NAMES', label: 'Names' },
  { slug: 'landing-page', name: 'LANDING PAGE', label: 'Landing Pages' },
  { slug: 'checkout-page', name: 'CHECKOUT PAGE', label: 'Checkout Pages' },
  { slug: 'chat-page', name: 'CHAT PAGE', label: 'Chat Pages' },
  { slug: 'ceo', name: 'CEO', label: 'CEOs' },
] as const;
export type Category = typeof categories[number]['slug'];
export type Entry = {
  id: string; category_id: Category; slug: string; name: string; company: string;
  website_url: string; source_url: string; image_url: string | null;
  elo_rating: number; wins: number; losses: number; total_votes: number;
  active: boolean; submission_status: string;
};
const brands = [
  ['Nike', 'Nike', 'https://www.nike.com'], ['Adidas', 'Adidas', 'https://www.adidas.com'], ['Apple', 'Apple', 'https://www.apple.com'],
  ['Spotify', 'Spotify', 'https://www.spotify.com'], ['Airbnb', 'Airbnb', 'https://www.airbnb.com'], ['Figma', 'Figma', 'https://www.figma.com'],
  ['Dropbox', 'Dropbox', 'https://www.dropbox.com'], ['Notion', 'Notion', 'https://www.notion.com'], ['Pinterest', 'Pinterest', 'https://www.pinterest.com'],
  ['Mastercard', 'Mastercard', 'https://www.mastercard.com'], ['Google', 'Google', 'https://google.com'], ['Meta', 'Meta', 'https://meta.com'],
  ['Tesla', 'Tesla', 'https://tesla.com'], ['Nvidia', 'Nvidia', 'https://nvidia.com'], ['Netflix', 'Netflix', 'https://netflix.com'],
  ['SAP', 'SAP', 'https://sap.com'], ['Intuit', 'Intuit', 'https://intuit.com'], ['Shopify', 'Shopify', 'https://shopify.com'],
  ['HubSpot', 'HubSpot', 'https://hubspot.com'], ['Atlassian', 'Atlassian', 'https://atlassian.com'], ['Zoom', 'Zoom', 'https://zoom.com'],
  ['Box', 'Box', 'https://box.com'], ['Asana', 'Asana', 'https://asana.com'], ['GitLab', 'GitLab', 'https://gitlab.com'],
  ['GitHub', 'GitHub', 'https://github.com'], ['Palantir', 'Palantir', 'https://palantir.com'], ['Snowflake', 'Snowflake', 'https://snowflake.com'],
  ['Databricks', 'Databricks', 'https://databricks.com'], ['Cloudflare', 'Cloudflare', 'https://cloudflare.com'], ['Okta', 'Okta', 'https://okta.com'],
  ['Datadog', 'Datadog', 'https://datadog.com'], ['MongoDB', 'MongoDB', 'https://mongodb.com'], ['Stripe', 'Stripe', 'https://stripe.com'],
  ['PayPal', 'PayPal', 'https://paypal.com'], ['Coinbase', 'Coinbase', 'https://coinbase.com'], ['Robinhood', 'Robinhood', 'https://robinhood.com'],
  ['Nubank', 'Nubank', 'https://nu.com.br'], ['Revolut', 'Revolut', 'https://revolut.com'], ['Wise', 'Wise', 'https://wise.com'],
  ['Klarna', 'Klarna', 'https://klarna.com'], ['Uber', 'Uber', 'https://uber.com'], ['Lyft', 'Lyft', 'https://lyft.com'],
  ['DoorDash', 'DoorDash', 'https://doordash.com'], ['Instacart', 'Instacart', 'https://instacart.com'], ['Reddit', 'Reddit', 'https://reddit.com'],
  ['X', 'X', 'https://x.com'], ['Discord', 'Discord', 'https://discord.com'], ['Twitch', 'Twitch', 'https://twitch.tv'],
  ['Roblox', 'Roblox', 'https://roblox.com'], ['Epic Games', 'Epic Games', 'https://epicgames.com'], ['Duolingo', 'Duolingo', 'https://duolingo.com'],
  ['TikTok', 'TikTok', 'https://tiktok.com'], ['Yelp', 'Yelp', 'https://yelp.com'], ['Booking.com', 'Booking.com', 'https://booking.com'],
  ['Expedia', 'Expedia', 'https://expedia.com'], ['eBay', 'eBay', 'https://ebay.com'], ['Etsy', 'Etsy', 'https://etsy.com'],
  ['Intel', 'Intel', 'https://intel.com'], ['AMD', 'AMD', 'https://amd.com'], ['Qualcomm', 'Qualcomm', 'https://qualcomm.com'],
  ['Cisco', 'Cisco', 'https://cisco.com'], ['Dell', 'Dell', 'https://dell.com'], ['HP', 'HP', 'https://hp.com'],
  ['Lenovo', 'Lenovo', 'https://lenovo.com'], ['Samsung', 'Samsung', 'https://samsung.com'], ['Sony', 'Sony', 'https://sony.com'],
  ['Anthropic', 'Anthropic', 'https://anthropic.com'], ['Target', 'Target', 'https://target.com'], ['Newegg', 'Newegg', 'https://newegg.com'],
  ['Algolia', 'Algolia', 'https://algolia.com'], ['Razorpay', 'Razorpay', 'https://razorpay.com'], ['Brex', 'Brex', 'https://brex.com'],
  ['Mixpanel', 'Mixpanel', 'https://mixpanel.com'], ['PagerDuty', 'PagerDuty', 'https://pagerduty.com'], ['Gusto', 'Gusto', 'https://gusto.com'],
  ['OpenSea', 'OpenSea', 'https://opensea.io'],
];
const names = [
  ['Perplexity', 'Perplexity', 'https://www.perplexity.ai'], ['Cursor', 'Anysphere', 'https://cursor.com'], ['Stripe', 'Stripe', 'https://stripe.com'],
  ['Figma', 'Figma', 'https://www.figma.com'], ['Linear', 'Linear', 'https://linear.app'], ['Vercel', 'Vercel', 'https://vercel.com'],
  ['Notion', 'Notion', 'https://www.notion.com'], ['Ramp', 'Ramp', 'https://ramp.com'], ['Mercury', 'Mercury', 'https://mercury.com'],
  ['Anthropic', 'Anthropic', 'https://www.anthropic.com'], ['Apple', 'Apple', 'https://apple.com'], ['Microsoft', 'Microsoft', 'https://microsoft.com'],
  ['Google', 'Google', 'https://google.com'], ['Amazon', 'Amazon', 'https://amazon.com'], ['Meta', 'Meta', 'https://meta.com'],
  ['Tesla', 'Tesla', 'https://tesla.com'], ['Nvidia', 'Nvidia', 'https://nvidia.com'], ['Netflix', 'Netflix', 'https://netflix.com'],
  ['Adobe', 'Adobe', 'https://adobe.com'], ['Salesforce', 'Salesforce', 'https://salesforce.com'], ['Oracle', 'Oracle', 'https://oracle.com'],
  ['SAP', 'SAP', 'https://sap.com'], ['IBM', 'IBM', 'https://ibm.com'], ['ServiceNow', 'ServiceNow', 'https://servicenow.com'],
  ['Workday', 'Workday', 'https://workday.com'], ['Intuit', 'Intuit', 'https://intuit.com'], ['Shopify', 'Shopify', 'https://shopify.com'],
  ['HubSpot', 'HubSpot', 'https://hubspot.com'], ['Atlassian', 'Atlassian', 'https://atlassian.com'], ['Zoom', 'Zoom', 'https://zoom.com'],
  ['Slack', 'Slack', 'https://slack.com'], ['Dropbox', 'Dropbox', 'https://dropbox.com'], ['Box', 'Box', 'https://box.com'],
  ['DocuSign', 'DocuSign', 'https://docusign.com'], ['Asana', 'Asana', 'https://asana.com'], ['Monday.com', 'Monday.com', 'https://monday.com'],
  ['Canva', 'Canva', 'https://canva.com'], ['GitLab', 'GitLab', 'https://gitlab.com'], ['GitHub', 'GitHub', 'https://github.com'],
  ['Palantir', 'Palantir', 'https://palantir.com'], ['Snowflake', 'Snowflake', 'https://snowflake.com'], ['Databricks', 'Databricks', 'https://databricks.com'],
  ['Cloudflare', 'Cloudflare', 'https://cloudflare.com'], ['CrowdStrike', 'CrowdStrike', 'https://crowdstrike.com'], ['Okta', 'Okta', 'https://okta.com'],
  ['Datadog', 'Datadog', 'https://datadog.com'], ['MongoDB', 'MongoDB', 'https://mongodb.com'], ['Twilio', 'Twilio', 'https://twilio.com'],
  ['PayPal', 'PayPal', 'https://paypal.com'], ['Block', 'Block', 'https://block.xyz'], ['Coinbase', 'Coinbase', 'https://coinbase.com'],
  ['Robinhood', 'Robinhood', 'https://robinhood.com'], ['SoFi', 'SoFi', 'https://sofi.com'], ['Chime', 'Chime', 'https://chime.com'],
  ['Nubank', 'Nubank', 'https://nu.com.br'], ['Revolut', 'Revolut', 'https://revolut.com'], ['Wise', 'Wise', 'https://wise.com'],
  ['Klarna', 'Klarna', 'https://klarna.com'], ['Affirm', 'Affirm', 'https://affirm.com'], ['Spotify', 'Spotify', 'https://spotify.com'],
  ['Uber', 'Uber', 'https://uber.com'], ['Lyft', 'Lyft', 'https://lyft.com'], ['Airbnb', 'Airbnb', 'https://airbnb.com'],
  ['DoorDash', 'DoorDash', 'https://doordash.com'], ['Instacart', 'Instacart', 'https://instacart.com'], ['Reddit', 'Reddit', 'https://reddit.com'],
  ['Pinterest', 'Pinterest', 'https://pinterest.com'], ['Snap', 'Snap', 'https://snap.com'], ['X', 'X', 'https://x.com'],
  ['Discord', 'Discord', 'https://discord.com'], ['Twitch', 'Twitch', 'https://twitch.tv'], ['Roblox', 'Roblox', 'https://roblox.com'],
  ['Epic Games', 'Epic Games', 'https://epicgames.com'], ['Duolingo', 'Duolingo', 'https://duolingo.com'], ['TikTok', 'TikTok', 'https://tiktok.com'],
  ['LinkedIn', 'LinkedIn', 'https://linkedin.com'], ['Yelp', 'Yelp', 'https://yelp.com'], ['Booking.com', 'Booking.com', 'https://booking.com'],
  ['Expedia', 'Expedia', 'https://expedia.com'], ['eBay', 'eBay', 'https://ebay.com'], ['Etsy', 'Etsy', 'https://etsy.com'],
  ['Intel', 'Intel', 'https://intel.com'], ['AMD', 'AMD', 'https://amd.com'], ['Qualcomm', 'Qualcomm', 'https://qualcomm.com'],
  ['Cisco', 'Cisco', 'https://cisco.com'], ['Dell', 'Dell', 'https://dell.com'], ['HP', 'HP', 'https://hp.com'],
  ['Lenovo', 'Lenovo', 'https://lenovo.com'], ['Samsung', 'Samsung', 'https://samsung.com'], ['Sony', 'Sony', 'https://sony.com'],
  ['Nintendo', 'Nintendo', 'https://nintendo.com'], ['OpenAI', 'OpenAI', 'https://openai.com'], ['Walmart', 'Walmart', 'https://walmart.com'],
  ['Target', 'Target', 'https://target.com'], ['Best Buy', 'Best Buy', 'https://bestbuy.com'], ['Costco', 'Costco', 'https://costco.com'],
  ['Home Depot', 'Home Depot', 'https://homedepot.com'], ['Nike', 'Nike', 'https://nike.com'], ['Adidas', 'Adidas', 'https://adidas.com'],
  ['Wayfair', 'Wayfair', 'https://wayfair.com'],
];
const landing = [names[2], names[3], names[4], names[5], names[6], names[7], names[8], names[9], brands[3], brands[4]];
const checkout = [
  ['Shopify Checkout', 'Shopify', 'https://www.shopify.com'], ['Stripe Checkout', 'Stripe', 'https://stripe.com/payments/checkout'],
  ['Amazon Checkout', 'Amazon', 'https://www.amazon.com'], ['Airbnb Checkout', 'Airbnb', 'https://www.airbnb.com'],
  ['Apple Checkout', 'Apple', 'https://www.apple.com'], ['Nike Checkout', 'Nike', 'https://www.nike.com'],
  ['Etsy Checkout', 'Etsy', 'https://www.etsy.com'], ['eBay Checkout', 'eBay', 'https://www.ebay.com'],
  ['Target Checkout', 'Target', 'https://www.target.com'], ['Walmart Checkout', 'Walmart', 'https://www.walmart.com'],
];
const chat = [
  ['ChatGPT', 'OpenAI', 'https://chatgpt.com'], ['Claude', 'Anthropic', 'https://claude.ai'],
  ['iMessage', 'Apple', 'https://www.apple.com/ios/messages/'], ['WhatsApp', 'Meta', 'https://www.whatsapp.com'],
  ['Messenger', 'Meta', 'https://www.messenger.com'], ['Discord', 'Discord', 'https://discord.com'],
  ['Slack', 'Salesforce', 'https://slack.com'], ['Telegram', 'Telegram', 'https://telegram.org'],
  ['Signal', 'Signal', 'https://signal.org'], ['Google Chat', 'Google', 'https://chat.google.com'],
];
// Names identify public founders or executives; this is not a current-role directory.
const ceos = [
  ['Tim Cook', 'Apple', 'https://www.apple.com'], ['Satya Nadella', 'Microsoft', 'https://www.microsoft.com'],
  ['Mark Zuckerberg', 'Meta', 'https://about.meta.com'], ['Jensen Huang', 'NVIDIA', 'https://www.nvidia.com'],
  ['Brian Chesky', 'Airbnb', 'https://www.airbnb.com'], ['Dylan Field', 'Figma', 'https://www.figma.com'],
  ['Patrick Collison', 'Stripe', 'https://stripe.com'], ['Melanie Perkins', 'Canva', 'https://www.canva.com'],
  ['Tobias Lütke', 'Shopify', 'https://www.shopify.com'], ['Aaron Levie', 'Box', 'https://www.box.com'],
];
const pools: Record<Category, string[][]> = { logos: brands, names, 'landing-page': landing, 'checkout-page': checkout, 'chat-page': chat, ceo: ceos };
export const seedEntries: Entry[] = categories.flatMap(c => pools[c.slug].map((row) => {
  const slug = `${c.slug}-${row[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
  return { id: slug, slug, category_id: c.slug, name: row[0], company: row[1], website_url: row[2], source_url: row[2], image_url: c.slug === 'logos' ? `/logos/${slug.slice('logos-'.length)}.svg` : null, elo_rating: 1500, wins: 0, losses: 0, total_votes: 0, active: true, submission_status: 'approved' };
}));
export const categoryLabel = (slug: string) => categories.find(c => c.slug === slug)?.label ?? slug;
export const isCategory = (value: string): value is Category => categories.some(c => c.slug === value);
export const imageLabel = (category: Category) => category === 'logos' ? 'Logo' : category === 'ceo' ? 'Portrait' : 'Screenshot';
