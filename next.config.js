/** @type {import('next').NextConfig} */
module.exports = (phase) => ({
  output: phase === 'phase-development-server' ? undefined : 'export',
  distDir: phase === 'phase-development-server' ? '.next-dev' : '.next',
  images: { unoptimized: true },
});
