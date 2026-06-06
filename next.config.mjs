import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/rates',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
