type ExecOptions = {
  env?: any;
  // TODO: add ssh wrapper
  ssh?: any;
};

export const exec = async (
  cmds: (string | null | undefined)[],
  options: Partial<ExecOptions> = {}
) => {
  const proc = Bun.spawn(cmds.filter((i) => i != null) as string[], {
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
