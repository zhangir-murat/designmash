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

const landing = [
  ['Stripe', 'Stripe', 'https://stripe.com'], ['Figma', 'Figma', 'https://www.figma.com'], ['Linear', 'Linear', 'https://linear.app'],
  ['Vercel', 'Vercel', 'https://vercel.com'], ['Notion', 'Notion', 'https://www.notion.com'], ['Ramp', 'Ramp', 'https://ramp.com'],
  ['Mercury', 'Mercury', 'https://mercury.com'], ['Anthropic', 'Anthropic', 'https://www.anthropic.com'], ['Spotify', 'Spotify', 'https://www.spotify.com'],
  ['Airbnb', 'Airbnb', 'https://www.airbnb.com'], ['Apple', 'Apple', 'https://apple.com'], ['Microsoft', 'Microsoft', 'https://microsoft.com'],
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
  ['Klarna', 'Klarna', 'https://klarna.com'], ['Affirm', 'Affirm', 'https://affirm.com'], ['Uber', 'Uber', 'https://uber.com'],
];

const checkout = [
  ['Shopify Checkout', 'Shopify', 'https://www.shopify.com'], ['Stripe Checkout', 'Stripe', 'https://stripe.com/payments/checkout'], ['Amazon Checkout', 'Amazon', 'https://www.amazon.com'],
  ['Airbnb Checkout', 'Airbnb', 'https://www.airbnb.com'], ['Apple Checkout', 'Apple', 'https://www.apple.com'], ['Nike Checkout', 'Nike', 'https://www.nike.com'],
  ['Etsy Checkout', 'Etsy', 'https://www.etsy.com'], ['eBay Checkout', 'eBay', 'https://www.ebay.com'], ['Target Checkout', 'Target', 'https://www.target.com'],
  ['Walmart Checkout', 'Walmart', 'https://www.walmart.com'], ['Dell Checkout', 'Dell', 'https://www.dell.com/en-us/shop/cart'], ['Adidas Checkout', 'Adidas', 'https://www.adidas.com/us/cart'],
  ['Home Depot Checkout', 'Home Depot', 'https://www.homedepot.com/c/cart'], ['Lenovo Checkout', 'Lenovo', 'https://www.lenovo.com/us/en/cart'], ['Best Buy Checkout', 'Best Buy', 'https://www.bestbuy.com'],
  ['Costco Checkout', 'Costco', 'https://www.costco.com'], ['Wayfair Checkout', 'Wayfair', 'https://www.wayfair.com'], ['Samsung Checkout', 'Samsung', 'https://www.samsung.com'],
];

const chat = [
  ['ChatGPT', 'OpenAI', 'https://chatgpt.com'], ['Claude', 'Anthropic', 'https://claude.ai'], ['iMessage', 'Apple', 'https://www.apple.com/ios/messages/'],
  ['WhatsApp', 'Meta', 'https://www.whatsapp.com'], ['Messenger', 'Meta', 'https://www.messenger.com'], ['Discord', 'Discord', 'https://discord.com'],
  ['Slack', 'Salesforce', 'https://slack.com'], ['Telegram', 'Telegram', 'https://telegram.org'], ['Signal', 'Signal', 'https://signal.org'],
  ['Google Chat', 'Google', 'https://chat.google.com'], ['Microsoft Teams', 'Microsoft', 'https://teams.microsoft.com'], ['Google Messages', 'Google', 'https://messages.google.com/web'],
  ['Instagram Direct', 'Meta', 'https://www.instagram.com/direct/inbox/'], ['X DMs', 'X Corp', 'https://x.com/messages'], ['Snapchat Web', 'Snap', 'https://web.snapchat.com'],
  ['LINE', 'LY Corporation', 'https://chat.line.biz'], ['WeChat Web', 'Tencent', 'https://web.wechat.com'], ['Skype Web', 'Microsoft', 'https://web.skype.com'],
  ['Zoom Chat', 'Zoom', 'https://app.zoom.us'], ['Element', 'Element', 'https://app.element.io'], ['Wire', 'Wire', 'https://app.wire.com'],
  ['Threema Web', 'Threema', 'https://web.threema.ch'],
];

// Names identify public founders or executives; this is not a current-role directory.
const ceos = [
  ['Tim Cook', 'Apple', 'https://www.apple.com'], ['Satya Nadella', 'Microsoft', 'https://www.microsoft.com'], ['Mark Zuckerberg', 'Meta', 'https://about.meta.com'],
  ['Jensen Huang', 'NVIDIA', 'https://www.nvidia.com'], ['Brian Chesky', 'Airbnb', 'https://www.airbnb.com'], ['Dylan Field', 'Figma', 'https://www.figma.com'],
  ['Patrick Collison', 'Stripe', 'https://stripe.com'], ['Melanie Perkins', 'Canva', 'https://www.canva.com'], ['Tobias Lütke', 'Shopify', 'https://www.shopify.com'],
  ['Aaron Levie', 'Box', 'https://www.box.com'], ['Elon Musk', 'Tesla', 'https://tesla.com'], ['Sundar Pichai', 'Google', 'https://google.com'],
  ['Sam Altman', 'OpenAI', 'https://openai.com'], ['Dario Amodei', 'Anthropic', 'https://anthropic.com'], ['Andy Jassy', 'Amazon', 'https://amazon.com'],
  ['Shantanu Narayen', 'Adobe', 'https://adobe.com'], ['Marc Benioff', 'Salesforce', 'https://salesforce.com'], ['Safra Catz', 'Oracle', 'https://oracle.com'],
  ['Lisa Su', 'AMD', 'https://amd.com'], ['Daniel Ek', 'Spotify', 'https://spotify.com'], ['Jack Dorsey', 'Block', 'https://block.xyz'],
  ['Steve Huffman', 'Reddit', 'https://reddit.com'], ['Evan Spiegel', 'Snap', 'https://snap.com'], ['Drew Houston', 'Dropbox', 'https://dropbox.com'],
  ['Dara Khosrowshahi', 'Uber', 'https://uber.com'], ['Mike Cannon-Brookes', 'Atlassian', 'https://atlassian.com'], ['Vlad Tenev', 'Robinhood', 'https://robinhood.com'],
  ['Tony Xu', 'DoorDash', 'https://doordash.com'], ['Eric Yuan', 'Zoom', 'https://zoom.com'], ['Alex Karp', 'Palantir', 'https://palantir.com'],
  ['Michael Dell', 'Dell', 'https://dell.com'], ['David Baszucki', 'Roblox', 'https://roblox.com'], ['Tim Sweeney', 'Epic Games', 'https://epicgames.com'],
  ['Luis von Ahn', 'Duolingo', 'https://duolingo.com'], ['Shou Zi Chew', 'TikTok', 'https://tiktok.com'], ['Nik Storonsky', 'Revolut', 'https://revolut.com'],
  ['Sebastian Siemiatkowski', 'Klarna', 'https://klarna.com'], ['Max Levchin', 'Affirm', 'https://affirm.com'], ['David Vélez', 'Nubank', 'https://nu.com.br'],
  ['Ali Ghodsi', 'Databricks', 'https://databricks.com'],
];

// Wikimedia Commons portrait per CEO entry slug (verified 200 + image/* on 2026-10-06).
// See README.md for per-image attribution links.
export const ceoPortraits: Record<string, string> = {
  'ceo-tim-cook': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/10/Tim_Cook_in_New_York_City_-_2026_%28cropped%29.jpg/960px-Tim_Cook_in_New_York_City_-_2026_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-satya-nadella': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/78/MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg/960px-MS-Exec-Nadella-Satya-2017-08-31-22_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-mark-zuckerberg': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/F20250904AH-2824_%2854778373111%29_%283x4_cropped_on_Zuckerberg_following_the_rule_of_thirds%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-jensen-huang': 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Jen-Hsun_Huang_2025.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-brian-chesky': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/9a/Brian_Chesky_2025.jpg/960px-Brian_Chesky_2025.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-dylan-field': 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Dylan_Field_TechCrunch_Disrupt_2022_1435088567_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-patrick-collison': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/7/74/Patrick_Collison_%28cropped%29.jpg/960px-Patrick_Collison_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-melanie-perkins': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/34/M_Perkins.jpg/960px-M_Perkins.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-tobias-lutke': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/2d/NYC-Commerce-Tobi-L%C3%BCtki-561.jpg/960px-NYC-Commerce-Tobi-L%C3%BCtki-561.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-aaron-levie': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/67/Aaron_Levie.jpg/960px-Aaron_Levie.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-elon-musk': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/5/5e/Elon_Musk_-_54820081119_%28cropped%29.jpg/960px-Elon_Musk_-_54820081119_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-sundar-pichai': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Sundar_Pichai_-_2023_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-sam-altman': 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Meeting_with_Masayoshi_Son_and_Sam_Altman_%28February_3%2C_2025%29_%283x4_cropped_on_Altman%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-dario-amodei': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e4/Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg/960px-Dario_Amodei_at_TechCrunch_Disrupt_2023_01_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-andy-jassy': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/07/Andy_Jassy.jpg/960px-Andy_Jassy.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-shantanu-narayen': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Shantanu_Narayen_-_the_CEO_of_Adobe_Inc.jpg/960px-Shantanu_Narayen_-_the_CEO_of_Adobe_Inc.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-marc-benioff': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/19/Marc_Benioff.jpg/960px-Marc_Benioff.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-safra-catz': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Safra_Catz_Oracle_CloudWorld_2024.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-lisa-su': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/de/SXSW-2024-alih-OB7A0861-Lisa_Su_%28cropped_2%29.jpg/960px-SXSW-2024-alih-OB7A0861-Lisa_Su_%28cropped_2%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-daniel-ek': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/3/39/Daniel_Ek_EC_2025_%28cropped%29.jpg/960px-Daniel_Ek_EC_2025_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-jack-dorsey': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/9/98/Jack_Dorsey_in_Washington_D.C._-_2018_%2844538272181%29_%28cropped%29.jpg/960px-Jack_Dorsey_in_Washington_D.C._-_2018_%2844538272181%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-steve-huffman': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e0/Web_Summit_2017_-_Centre_Stage_Day_2_CG1_7885_%2838232183112%29_%28cropped%29.jpg/960px-Web_Summit_2017_-_Centre_Stage_Day_2_CG1_7885_%2838232183112%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-evan-spiegel': 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Evan_Spiegel%2C_founder_of_Snapchat.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-drew-houston': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Drew_Houston_at_Web_Summit_%28cropped%29.jpg/500px-Drew_Houston_at_Web_Summit_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-dara-khosrowshahi': 'https://upload.wikimedia.org/wikipedia/commons/1/15/CEO_of_Uber_Technologies_Dara_Khosrowshahi_in_New_York_-_2019_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-mike-cannon-brookes': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/6/6d/Mike_Cannon-Brookes_Australian_businessman.jpg/960px-Mike_Cannon-Brookes_Australian_businessman.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-vlad-tenev': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ef/Portrait_of_Vlad_Tenev.jpg/960px-Portrait_of_Vlad_Tenev.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-tony-xu': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d3/TechCrunch_Disrupt_San_Francisco_2018_-_day_1_%2843784924924%29_%28cropped%29.jpg/960px-TechCrunch_Disrupt_San_Francisco_2018_-_day_1_%2843784924924%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-eric-yuan': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/Eric_Yuan_2025_%28cropped%29.jpg/960px-Eric_Yuan_2025_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-alex-karp': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Alex_Karp_attends_AI_Summit_%2853302457013%29_4-5_ratio.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-michael-dell': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Michael_Dell_%2852548152888%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-david-baszucki': 'https://upload.wikimedia.org/wikipedia/commons/e/ec/David_Baszucki_and_Jan_Ellison%2C_RDC_2025_%28cropped_2%29.png?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-tim-sweeney': 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Tim_Sweeney%2C_GDCA_2017_%28portrait_crop%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-luis-von-ahn': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/2/20/Wikimania_2015_-_Day_2_%2818%29_%28cropped%29.jpg/960px-Wikimania_2015_-_Day_2_%2818%29_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-shou-zi-chew': 'https://upload.wikimedia.org/wikipedia/commons/b/bc/TikTok_CEO_Shou_Zi_Chew.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-nik-storonsky': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/11/2022_-_Centre_Stage_HM3_3900_%2852472531881%29.jpg/960px-2022_-_Centre_Stage_HM3_3900_%2852472531881%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-sebastian-siemiatkowski': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/1/16/Sebastian_Siemiatkowski_TC_2019.jpg/960px-Sebastian_Siemiatkowski_TC_2019.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-max-levchin': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c6/Max_Levchin_%282013%29.jpg/960px-Max_Levchin_%282013%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
  'ceo-david-velez': 'https://upload.wikimedia.org/wikipedia/commons/7/75/SAM_5134_%28cropped%29.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail_unscaled',
  'ceo-ali-ghodsi': 'https://thumb.wikimedia.org/wikipedia/commons/thumb/f/f0/Databricks_Ali_Ghodsi_26.jpg/960px-Databricks_Ali_Ghodsi_26.jpg?utm_source=en.wikipedia.org&utm_campaign=api&utm_content=thumbnail',
};

const pools: Record<Category, string[][]> = { logos: brands, names, 'landing-page': landing, 'checkout-page': checkout, 'chat-page': chat, ceo: ceos };
export const seedEntries: Entry[] = categories.flatMap(c => pools[c.slug].map((row) => {
  const slug = `${c.slug}-${row[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-$/, '')}`;
  const image_url = c.slug === 'logos' ? `/logos/${row[0].toLowerCase()}.svg`
    : c.slug === 'names' ? null
    : c.slug === 'ceo' ? (ceoPortraits[slug] ?? null)
    : `https://s0.wp.com/mshots/v1/${encodeURIComponent(row[2])}?w=1280`;
  return { id: slug, slug, category_id: c.slug, name: row[0], company: row[1], website_url: row[2], source_url: row[2], image_url, elo_rating: 1500, wins: 0, losses: 0, total_votes: 0, active: true, submission_status: 'approved' };
}));
export const categoryLabel = (slug: string) => categories.find(c => c.slug === slug)?.label ?? slug;
export const isCategory = (value: string): value is Category => categories.some(c => c.slug === value);
export const imageLabel = (category: Category) => category === 'logos' ? 'Logo' : category === 'ceo' ? 'Portrait' : 'Screenshot';
