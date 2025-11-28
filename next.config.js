/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Desabilitar o strict mode para evitar problemas de HMR
  webpack: (config) => {
    // Ajustes para melhorar o HMR
    config.watchOptions = {
      ...config.watchOptions,
      poll: 1000, // Verificar alterações a cada segundo
      aggregateTimeout: 300, // Agrupar várias alterações
    };
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/macros/macros',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;