package config

import (
	"api/log"
	"fmt"
	"gopkg.in/yaml.v2"
	"io/ioutil"
	"os"
	"strings"
)

type EnvironmentConfig struct {
	ValidatorsStorePath string `yaml:"validatorsStorePath"`
	InstitutesStorePath string `yaml:"institutesStorePath"`
	EndpointPort        int    `yaml:"endpointPort"`
	ApiPassword         string `yaml:"apiPassword"`
}

func LoadEnvironmentConfig(envName string, appEnvironmentFileDir string) (environment EnvironmentConfig, err error) {
	// Load from config file
	appConfig, err := loadConfigFromFile(appEnvironmentFileDir + ".env." + envName + ".yml")
	if err != nil {
		log.Error("Error while loading environment. Could not load config from file: ", err, log.Config)
		return
	}

	return appConfig, err
}

func (c EnvironmentConfig) ConfigToString() string {
	var sb strings.Builder
	sb.WriteString("\n")
	sb.WriteString("Environment file data:\n")
	sb.WriteString(fmt.Sprintln("  ValidatorsStorePath: ", c.ValidatorsStorePath))
	sb.WriteString(fmt.Sprintln("  InstitutesStorePath: ", c.InstitutesStorePath))
	sb.WriteString(fmt.Sprintln("  EndpointPort: ", c.EndpointPort))
	sb.WriteString(fmt.Sprintln("  ApiPassword: ", c.ApiPassword))
	return sb.String()
}

func loadConfigFromFile(fileName string) (config EnvironmentConfig, loadError error) {
	ymlFile, loadError := os.Open(fileName)
	if loadError != nil {
		log.Error("Cannot open config file: ", loadError, log.Config)
		return
	}
	defer ymlFile.Close()

	byteValue, loadError := ioutil.ReadAll(ymlFile)
	if loadError != nil {
		log.Error("Cannot read config file: ", loadError, log.Config)
		return
	}

	loadError = yaml.Unmarshal(byteValue, &config)
	if loadError != nil {
		log.Error("Cannot unmarshal config file: ", loadError, log.Config)
		return
	}
	return
}
