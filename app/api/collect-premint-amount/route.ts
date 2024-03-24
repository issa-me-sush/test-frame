import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function collectPreMintAmount(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'YOUR_NEYNAR_ONCHAIN_KIT_API_KEY' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 400 });
  }

  // Assuming adName, imageUri, and ethAmount were passed to this step in the input
  const previousData = encodeURIComponent(message.input); // This contains 'adName', 'imageUri', and 'ethAmount'

  // Append '&preMintAdAmount=' to the existing data for the user to fill in
  const newData = `${previousData}&preMintAdAmount=`; // Placeholder for user input

  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Submit Pre-Mint Amount',
        target: `${NEXT_PUBLIC_URL}/api/deploy-token`, // Next step for token deployment
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
  return collectPreMintAmount(req);
}

export const dynamic = 'force-dynamic';
