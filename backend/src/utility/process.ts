type ExecOptions = {
  env?: any;
  // TODO: add ssh wrapper
  ssh?: any;
};

export const exec = async (
  cmds: string[],
  options: Partial<ExecOptions> = {}
) => {
  const proc = Bun.spawn(cmds, {
    env: options.env,
    stderr: "pipe",
  });
  const err = await new Response(proc.stderr).text();
  const res = await new Response(proc.stdout).text();

  if (err) {
    throw new Error(err);
  }

  return res;
};
