/**
 * Debug homepage content structure
 */

import Contentstack, { Region } from 'contentstack';

const stack = Contentstack.Stack({
  api_key: 'blt21acc05a755b2972',
  delivery_token: 'csb961ece4b53599e198242dac',
  environment: 'preview',
  region: Region.US,
});

async function debug() {
  console.log('🔍 Debugging Homepage Content...\n');

  // Get homepage
  const homeQuery = stack.ContentType('home_page').Query();
  homeQuery.where('url', '/');
  homeQuery.includeReference(['hero']);
  const homeResult = await homeQuery.toJSON().find();
  const homePage = homeResult?.[0]?.[0];

  console.log('📄 Homepage:');
  console.log(JSON.stringify(homePage, null, 2));

  // Get hero banner
  console.log('\n\n🎯 Hero Banners:');
  const heroQuery = stack.ContentType('hero_banner').Query();
  heroQuery.limit(1);
  const heroResult = await heroQuery.toJSON().find();
  console.log(JSON.stringify(heroResult?.[0]?.[0], null, 2));

  // Get articles
  console.log('\n\n📰 Articles (first one):');
  const articleQuery = stack.ContentType('article').Query();
  articleQuery.limit(1);
  const articleResult = await articleQuery.toJSON().find();
  console.log(JSON.stringify(articleResult?.[0]?.[0], null, 2));
}

debug().catch(console.error);
