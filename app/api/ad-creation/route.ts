import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { base,sepolia  , baseSepolia } from 'viem/chains';
import AdContractABI from '../../_contracts/AdContractABI';
import { AD_CONTRACT_ADDR } from '../../config'; // Use your actual contract address
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';

async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  
  const state = JSON.parse(decodeURIComponent(message?.state.serialized || ""))
  console.log(state)
  // Decode the input to extract the necessary parameters
  const adName =state.adName;
  const imageUri = state.imageUri;
  const ethAmount = state.ethAmount;
  const preMintAdAmount = state.input;
  const tokenAddress = message.input

  // Encode the function call to the createAd function of your contract
  const data = encodeFunctionData({
    abi: AdContractABI,
    functionName: 'createAd',
    // @ts-ignore 
    args: [adName || "", tokenAddress , parseEther(ethAmount || "0"), parseInt(preMintAdAmount || "0"), imageUri],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${baseSepolia.id}`, // Adjust according to your network
    method: 'eth_sendTransaction',
    params: {
      abi: AdContractABI,
      data,
      to: AD_CONTRACT_ADDR,
    //   @ts-ignore 
      value: parseEther(ethAmount).toString(), // The ETH amount for the transaction
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
