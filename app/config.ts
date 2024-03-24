// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://test-frame-two.vercel.app';
export const AD_CONTRACT_ADDR = '0x2feEdc2a029F2d925A9b6dc6c54D669cCca5d849';
