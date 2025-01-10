const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const shell = require("shelljs");
const path = require("path");
const { command } = require("yargs");

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

function succeedWithMessage(message) {
  console.log(message);
  process.exit(0);
}
function generateMigration(migrationName, inDocker = false) {
  const migrationPath = path.posix.join("src", "db", "migrations", migrationName);
  const command = `${inDocker ? "docker exec server" : ""} pnpm --filter server run migration:generate ${migrationPath}`;
  const result = shell.exec(command);
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}

function runMigration(inDocker = false) {
  const command = `${inDocker ? "docker exec server" : ""} pnpm --filter server run migration:run`;
  const result = shell.exec(command);
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}
function revertMigration(inDocker = false) {
  const command = `${inDocker ? "docker exec server" : ""} pnpm --filter server run migration:revert`;

  const result = shell.exec(command);
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}

function buildDocker(prod, dev, noCache = false) {
  let result;
  if (dev) {
    result = shell.exec(`docker-compose -f docker-compose.dev.yaml build ${noCache ? "--no-cache" : ""}`);
  } else if (prod) {
    result = shell.exec(`docker-compose -f docker-compose.yaml build ${noCache ? "--no-cache" : ""}`);
  } else {
    exitWithError("Unexpected error");
  }

  if (result.code !== 0) {
    exitWithError(result.stderr);
  } else {
    succeedWithMessage(result.stdout);
  }
}

function startDocker(prod, dev) {
  let result;
  if (dev) {
    result = shell.exec("docker-compose -f docker-compose.dev.yaml up");
  } else if (prod) {
    result = shell.exec("docker-compose -f docker-compose.yaml up");
  } else {
    exitWithError("Unexpected error");
  }

  if (result.code !== 0) {
    exitWithError(result.stderr);
  } else {
    succeedWithMessage(result.stdout);
  }
}

function endDocker(prod, dev) {
  let result;
  if (dev) {
    result = shell.exec("docker-compose -f docker-compose.dev.yaml down");
  } else if (prod) {
    result = shell.exec("docker-compose -f docker-compose.yaml down");
  } else {
    exitWithError("Unexpected error");
  }

  if (result.code !== 0) {
    exitWithError(result.stderr);
  } else {
    succeedWithMessage(result.stdout);
  }
}

function buildSharedForDocker() {
  let result;
  console.log("Building for app");
  result = shell.exec("docker exec app pnpm --filter shared run build");
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  console.log("Building for server");
  result = shell.exec("docker exec server pnpm --filter shared run build");
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}

function buildProject(project, watch = false, noOutput = false) {
  const validProjects = ["server", "app", "shared"];
  if (!validProjects.includes(project)) {
    exitWithError("Invalid project name provided. Please provide a valid project name");
  }
  let result;
  let command = `pnpm --filter ${project} run build`;
  if (watch) {
    command = `${command}:watch`;
  }
  if (noOutput) {
    command = `nohup ${command} > /dev/null 2>&1 &`;
  }
  result = shell.exec(command);
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}

function startProject(project) {
  const validProjects = ["server", "app"];
  if (!validProjects.includes(project)) {
    exitWithError("Invalid project name provided. Please provide a valid project name");
  }

  let result;
  if (project === "server") {
    result = shell.exec("pnpm --filter server run start:dev");
  } else if (project === "app") {
    result = shell.exec("pnpm --filter app run start");
  }

  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}


function dropSchema() {
  const result = shell.exec("docker exec server pnpm --filter server run schema:drop");
  if (result.code !== 0) {
    exitWithError(result.stderr);
  }
  succeedWithMessage(result.stdout);
}

async function main() {
  const arguments = hideBin(process.argv);

  return yargs(arguments)
    .command(
      "docker:build",
      "Build the docker compose project",
      (yargs) => {
        yargs
          .option("x", {
            alias: "exclude-cache",
            describe: "Build containers without caching",
            type: "boolean",
            default: false,
          })
          .option("d", {
            alias: "dev",
            describe: "Build docker containers for development environment",
            type: "boolean",
            default: false,
          })
          .option("p", {
            alias: "prod",
            describe: "Build docker containers for production environment",
            type: "boolean",
            default: false,
          });
      },
      (argv) => {
        if (!argv.d && !argv.p) {
          exitWithError("Please select any of the options to run this command -p, --prod, -d or --dev");
        }
        if (argv.d && argv.p) {
          exitWithError("Both production and development cannot be enabled at the same time. Please choose only one flag");
        }

        buildDocker(argv.p, argv.d, argv.x);
      }
    )
    .command(
      "docker:end",
      "Down the docker compose project",
      (yargs) => {
        yargs
          .option("d", {
            alias: "dev",
            describe: "Build docker containers for development environment",
            type: "boolean",
            default: false,
          })
          .option("p", {
            alias: "prod",
            describe: "Build docker containers for production environment",
            type: "boolean",
            default: false,
          });
      },
      (argv) => {
        if (!argv.d && !argv.p) {
          exitWithError("Please select any of the options to run this command -p, --prod, -d or --dev");
        }
        if (argv.d && argv.p) {
          exitWithError("Both production and development cannot be enabled at the same time. Please choose only one flag");
        }

        endDocker(argv.p, argv.d);
      }
    )
    .command(
      "docker:start",
      "Up the docker compose project",
      (yargs) => {
        yargs
          .option("d", {
            alias: "dev",
            describe: "Build docker containers for development environment",
            type: "boolean",
            default: false,
          })
          .option("p", {
            alias: "prod",
            describe: "Build docker containers for production environment",
            type: "boolean",
            default: false,
          });
      },
      (argv) => {
        if (!argv.d && !argv.p) {
          exitWithError("Please select any of the options to run this command -p, --prod, -d or --dev");
        }
        if (argv.d && argv.p) {
          exitWithError("Both production and development cannot be enabled at the same time. Please choose only one flag");
        }

        startDocker(argv.p, argv.d);
      }
    )
    .command(
      "migration:generate",
      "Generate a new migration",
      (yargs) => {
        yargs
          .option("m", {
            alias: "migration-name",
            describe: "The name of the migration",
            type: "string",
            demandOption: true,
          })
          .option("d", {
            alias: "docker",
            describe: "Apply migrations within the running docker container",
            type: "boolean",
            default: false,
          });
      },
      (argv) => {
        const migrationName = argv.m;
        if (migrationName.trim().length === 0) {
          exitWithError("An empty string has been provided for the migration name. Please enter a valid string.");
        }
        generateMigration(argv.m, argv.d);
      }
    )
    .command(
      "migration:revert",
      "Revert the latest migration",
      (yargs) => {
        yargs.option("d", {
          alias: "docker",
          describe: "Apply migrations within the running docker container",
          type: "boolean",
          default: false,
        });
      },
      (argv) => {
        revertMigration(argv.d);
      }
    )
    .command(
      "migration:run",
      "Run the latest migrations",
      (yargs) => {
        yargs.option("d", {
          alias: "docker",
          describe: "Apply migrations within the running docker container",
          type: "boolean",
          default: false,
        });
      },
      (argv) => {
        runMigration(argv.d);
      }
    )
    .command(
      "project:build",
      "Build the project",
      (yargs) => {
        yargs
          .option("p", {
            alias: "project",
            describe: "The project to build",
            type: "string",
            demandOption: true,
          })
          .option("w", {
            alias: "watch",
            describe: "Watch for file changes",
            type: "boolean",
            default: false,
          })
          .option("n", {
            alias: "no-output",
            describe: "Do not display output",
            type: "boolean",
            default: false,
          });
      },
      (argv) => {
        console.log(argv.p);
        buildProject(argv.p, argv.w, argv.n);
      }
    )
    .command(
      "project:start",
      "Start the project",
      (yargs) => {
        yargs.option("p", {
          alias: "project",
          describe: "The project to start",
          type: "string",
          demandOption: true,
        });
      },
      (argv) => {
        startProject(argv.p);
      }
    )
    .command(
      "shared:build",
      "Build the shared project",
      (_yargs) => {},
      (_argv) => {
        buildSharedForDocker();
      }
    )
    .command(
      "schema:drop",
      "Drop the schema",
      (_yargs) => {},
      (_argv) => {
        dropSchema();
      }
    )
    .help()
    .parseAsync();
}

main();
