export async function State<Data, ExitCode>({
	data,
	enter,
	live,
	exit,
}: {
	data: Data;
	enter: (data: Data) => Promise<void>;
	live: (data: Data) => Promise<ExitCode>;
	exit: (data: Data, exitCode: ExitCode) => Promise<ExitCode>;
}) {
	await enter(data);
	const exitCode = await live(data);
	return await exit(data, exitCode);
}
