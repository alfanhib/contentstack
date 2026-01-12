import Contentstack from 'contentstack';

const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY || '',
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN || '',
  environment: process.env.CONTENTSTACK_ENVIRONMENT || 'development',
  region: Contentstack.Region.US,
});

export default Stack;

// Helper function to get entries
export async function getEntry(contentTypeUid: string, entryUid?: string) {
  try {
    const query = Stack.ContentType(contentTypeUid).Query();
    if (entryUid) {
      const entry = await Stack.ContentType(contentTypeUid).Entry(entryUid).fetch();
      return entry;
    }
    const entries = await query.toJSON().find();
    return entries[0];
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
}

// Get all entries of a content type
export async function getAllEntries(contentTypeUid: string) {
  try {
    const query = Stack.ContentType(contentTypeUid).Query();
    const entries = await query.toJSON().find();
    return entries[0] || [];
  } catch (error) {
    console.error('Error fetching entries:', error);
    return [];
  }
}
