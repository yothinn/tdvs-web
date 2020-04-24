// declare var process: Process;

interface Process {
  env: Env
}

interface Env {
  API_URL: string;
}

interface GlobalEnvironment {
  process: Process
}