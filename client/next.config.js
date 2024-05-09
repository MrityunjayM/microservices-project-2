export default {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 300,
      };
    }
    return config;
  },
};
