import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function collectImageUri(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 400 });
  }

  // Assuming the ad name was passed to this step in the input
  const previousData = encodeURIComponent(message.input); // This contains 'adName'

 
  const newData = `${previousData}&imageUri=`; // Placeholder for user input

  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Submit Image URI',
        target: `${NEXT_PUBLIC_URL}/api/collect-eth-amount`, // Next step to collect ETH amount
      },
    ],
    image: {
      src: `${NEXT_PUBLIC_URL}/park-1.png`, // Placeholder image for this step
      aspectRatio: '1:1',
    },
    input: {
      text: newData, // Pass the concatenated data for the next step
    },
    postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
  }));
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  return collectImageUri(req);
}

export const dynamic = 'force-dynamic';
