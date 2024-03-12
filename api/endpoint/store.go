package endpoint

import (
	"api/log"
	"encoding/json"
	"errors"
	"fmt"
	"os"
)

func storeMapValidators(validators []MapItem, mapValidatorsPath string) error {
	f, err := os.Create(mapValidatorsPath)
	log.Info(mapValidatorsPath)

	defer f.Close()

	if err != nil {
		return errors.New(fmt.Sprint("Failed to create validator file: ", mapValidatorsPath, "error: ", err))
	}

	validatorsString, err := json.MarshalIndent(validators, "", "    ")
	if err != nil {
		return errors.New(fmt.Sprint("Failed to marshal json to write to validator file: ", mapValidatorsPath, "error: ", err))
	}

	_, err = f.Write(validatorsString)
	if err != nil {
		return errors.New(fmt.Sprint("Failed to write to validator file: ", mapValidatorsPath, "error: ", err))
	}

	log.Info("Validators written successfully", log.Bloxberg)
	return nil
}

func readValidators(mapValidatorsPath string) ([]MapItem, error) {
	data, err := os.ReadFile(mapValidatorsPath)
	if err != nil {
		return make([]MapItem, 0), errors.New(fmt.Sprint("Failed to read map validator file: ", mapValidatorsPath, "error: ", err))
	}

	var validators []MapItem
	err = json.Unmarshal(data, &validators)
	if err != nil {
		return make([]MapItem, 0), errors.New(fmt.Sprint("Failed to unmarshal json from validators fil: ", mapValidatorsPath, "error: ", err))
	}

	return validators, nil
}

func storeMapInstitutes(institutes []MapItem, mapInstitutesPath string) error {
	f, err := os.Create(mapInstitutesPath)
	log.Info(mapInstitutesPath)

	defer f.Close()

	if err != nil {
		return errors.New(fmt.Sprint("Failed to create validator file: ", mapInstitutesPath, "error: ", err))
	}

	institutesString, err := json.MarshalIndent(institutes, "", "    ")
	if err != nil {
		return errors.New(fmt.Sprint("Failed to marshal json to write to validator file: ", mapInstitutesPath, "error: ", err))
	}

	_, err = f.Write(institutesString)
	if err != nil {
		return errors.New(fmt.Sprint("Failed to write to validator file: ", mapInstitutesPath, "error: ", err))
	}

	log.Info("Validators written successfully", log.General)
	return nil
}

func readInstitutes(mapInstitutesPath string) ([]MapItem, error) {
	data, err := os.ReadFile(mapInstitutesPath)
	if err != nil {
		return make([]MapItem, 0), errors.New(fmt.Sprint("Failed to read map validator file: ", mapInstitutesPath, "error: ", err))
	}

	var institutes []MapItem
	err = json.Unmarshal(data, &institutes)
	if err != nil {
		return make([]MapItem, 0), errors.New(fmt.Sprint("Failed to unmarshal json from validators fil: ", mapInstitutesPath, "error: ", err))
	}

	return institutes, nil
}
