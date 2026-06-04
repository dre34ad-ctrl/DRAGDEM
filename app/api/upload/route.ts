
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname,
        clientPayload
      ) => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error('Unauthenticated');

        const payload = clientPayload ? JSON.parse(clientPayload) : {};
        const { category } = payload;

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'video/mp4', 'audio/mpeg'],
          tokenPayload: JSON.stringify({
            userId: user.id,
            category,
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const { category, userId } = JSON.parse(tokenPayload!);
        const supabase = await createClient();

        console.log('Upload completed:', blob.url, 'for category:', category);

        try {
          if (category === 'vault') {
            const fileType = blob.contentType?.startsWith('video') ? 'video' : 
                            blob.contentType?.startsWith('audio') ? 'audio' : 'image';
            
            await supabase.from('vault_assets').insert({
              performer_id: userId,
              type: fileType,
              url: blob.url,
              metadata: JSON.stringify({
                originalName: blob.pathname,
                size: blob.size,
                contentType: blob.contentType
              })
            });
          }
        } catch (error) {
          console.error('Database update failed:', error);
          throw new Error('Could not update database');
        }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
