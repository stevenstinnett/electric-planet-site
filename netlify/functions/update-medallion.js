import { createClient } from '@supabase/supabase-js';

export const handler = async (event) => {
  try {
    const { medallionId, storageUrl, caption } = JSON.parse(event.body);

    if (!medallionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing medallionId' })
      };
    }

    // Connect to Supabase using environment variables
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Upsert (insert or update) the medallion record
    const { data, error } = await supabase
      .from('medallions')
      .upsert({
        id: medallionId,
        storage_url: storageUrl || null,
        caption: caption || null,
        updated_at: new Date()
      });

    if (error) {
      console.error('Supabase error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to update medallion' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data })
    };

  } catch (err) {
    console.error('Unexpected error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Unexpected server error' })
    };
  }
};
