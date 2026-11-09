/** @type {import('next').NextConfig} */
module.exports = (phase) => ({
  output: 'export',
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  images: { unoptimized: true },
});
