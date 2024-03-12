package main

import (
	"api/config"
	"api/endpoint"
	"api/log"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	// Get program arguments
	programArgs := GetProgramArguments()

	// Init logger
	log.Init(programArgs.LogAbsolutePath, programArgs.LogMaxSize, programArgs.LogMaxBackups, programArgs.LogMaxAge,
		programArgs.LogCompress, programArgs.LogLevel, programArgs.AppEnvironment)

	// Load environment
	env, envErr := config.LoadEnvironmentConfig(programArgs.AppEnvironment, programArgs.AppEnvironmentFileDir)
	if envErr != nil {
		log.Error("Could not load environment.", envErr, log.Main)
	}

	log.Info("Launching application ...", log.Main)
	log.Info(programArgs.ProgramArgsToString(), log.Main)
	log.Info(env.ConfigToString(), log.Main)

	// Listen to system signals
	log.Info("Listening to system signals ...", log.Main)
	systemSignal := ListenToSystemSignals()

	// Start bloxberg world map api endpoint
	log.Info("Start bloxberg world map api endpoint...", log.Main)
	endpoint.StartHttpServer(env.ValidatorsStorePath, env.InstitutesStorePath, env.ApiPassword, env.EndpointPort)

	// Application successfully started
	logMessage := "Application successfully started"
	log.Info(logMessage, log.Main)

	// Wait for a terminating signal from the system
	log.Info("Waiting for a terminating signal from the system ...", log.Main)
	<-*systemSignal
}

func GetProgramArguments() config.ProgramArguments {
	appEnvironment := flag.String("appEnvironment", "prod", "The environment the app should run with.")
	appEnvironmentFileDir := flag.String("appEnvironmentFileDir", "./", "The directory the environment file is located.")
	logAbsPath := flag.String("logAbsPath", "/var/log/hatnoteapp/hatnoteapp.log", "The absolute path to the log file.")
	logMaxSize := flag.Int("logMaxSize", 200, "The maximum file size of the log file in megabytes.")
	logMaxBackups := flag.Int("logMaxBackups", 2, "The maximum number of log file backups.")
	logMaxAge := flag.Int("logMaxAge", 28, "The maximum age in days of a log file before it gets backed up.")
	logCompress := flag.Bool("logCompress", true, "Determines if the log file backups should be compressed.")
	logLevel := flag.Int("logLevel", 4, "Determines which log types should be logged (FATAL=1, ERROR=2, WARN=3, INFO=4, DEBUG=5, TRACE=6). Includes lower levels.")

	flag.Parse()

	return config.ProgramArguments{AppEnvironment: *appEnvironment, AppEnvironmentFileDir: *appEnvironmentFileDir,
		LogAbsolutePath: *logAbsPath,
		LogMaxSize:      *logMaxSize, LogMaxBackups: *logMaxBackups, LogMaxAge: *logMaxAge,
		LogCompress: *logCompress, LogLevel: *logLevel,
	}
}

func ListenToSystemSignals() *chan bool {
	sigs := make(chan os.Signal, 1)
	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)
	done := make(chan bool, 1)

	go func() {
		sig := <-sigs

		if sig == syscall.SIGTERM || sig == syscall.SIGINT {
			log.Info(fmt.Sprintf("Received system signal: %s", sig.String()), log.Main)
			logMessage := "Application stopped."
			log.Info(logMessage, log.Main)
			os.Exit(0)
		}

		done <- true
	}()

	return &done
}
