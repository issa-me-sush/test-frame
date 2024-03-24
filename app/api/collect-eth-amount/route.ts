import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function collectEthAmount(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 400 });
  }

  // Assuming adName and imageUri were passed to this step in the input
  const previousData = encodeURIComponent(message.input); // This contains 'adName' and 'imageUri'

  // Append '&ethAmount=' to the existing data for the user to fill in
  const newData = `${previousData}&ethAmount=`; // Placeholder for user input

  return new NextResponse(getFrameHtmlResponse({
    buttons: [
      {
        action: 'post',
        label: 'Submit ETH Amount',
        target: `${NEXT_PUBLIC_URL}/api/collect-premint-amount`, // Next step to collect pre-mint ad amount
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
  return collectEthAmount(req);
}

export const dynamic = 'force-dynamic';
