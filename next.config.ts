module.exports = {
	async redirects() {
		return [
			{
				source: "/",
				destination: "/dashboard",
				permanent: true, // Use true for 301 redirects (permanent), false for 302 (temporary)
			},
		];
	},
};
