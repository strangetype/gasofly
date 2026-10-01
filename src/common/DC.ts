function DC<
	Entities extends {
		[name: string]: any;
	},
>(entities: Entities) {
	function create<Result>(creator: (entities: Entities) => Result) {
		return creator(entities);
	}
	return {
		create,
	};
}

export default DC;
