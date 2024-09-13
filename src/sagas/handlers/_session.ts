export default (state: any) => {
	return {
		_id: state?.user?._id,
		token: state?.user?.sessionToken,
	}
};
