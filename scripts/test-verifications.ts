import { awardVerification, refreshDignitySeal } from './lib/actions/verifications';

async function test() {
  const performerId = 'sasha-sparkle';
  console.log(`Awarding verification to ${performerId}...`);
  await awardVerification(performerId, 'manual');
  
  console.log(`Refreshing dignity seal for ${performerId}...`);
  await refreshDignitySeal(performerId);
  
  console.log('Done!');
}

test().catch(console.error);
