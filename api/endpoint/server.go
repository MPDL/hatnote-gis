package endpoint

import (
	"api/log"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With, hatnote-gis-api-password")
		c.Header("Access-Control-Allow-Methods", "POST,HEAD,PATCH, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	}
}

func StartHttpServer(mapValidatorsStorePath string, mapInstitutesStorePath string, api_password string, apiPort int) {
	router := gin.Default()
	router.Use(CORSMiddleware())

	router.GET("/geoBloxbergValidators", func(c *gin.Context) {
		provided_api_password := c.GetHeader("hatnote-gis-api-password")

		if provided_api_password != api_password {
			log.Info("Access to GET /geoBloxbergValidators denied: wrong password.")
			c.IndentedJSON(http.StatusUnauthorized, make([]MapItem, 0))
		} else {
			validators, err := readValidators(mapValidatorsStorePath)
			if err != nil {
				log.Error("Error while reading validators", err, log.Bloxberg)
				c.IndentedJSON(http.StatusInternalServerError, validators)
				return
			}
			c.IndentedJSON(http.StatusOK, validators)
		}
	})

	router.GET("/geoMpgInstitutes", func(c *gin.Context) {
		provided_api_password := c.GetHeader("hatnote-gis-api-password")

		if provided_api_password != api_password {
			log.Info("Access to GET /geoMpgInstitutes denied: wrong password.")
			c.IndentedJSON(http.StatusUnauthorized, make([]MapItem, 0))
		} else {
			institutes, err := readInstitutes(mapInstitutesStorePath)
			if err != nil {
				log.Error("Error while reading institutes", err, log.Bloxberg)
				c.IndentedJSON(http.StatusInternalServerError, institutes)
				return
			}
			c.IndentedJSON(http.StatusOK, institutes)
		}
	})

	router.POST("/geoBloxbergValidators", func(c *gin.Context) {
		provided_api_password := c.GetHeader("hatnote-gis-api-password")
		if provided_api_password != api_password {
			log.Info("Access to POST /geoBloxbergValidators denied: wrong password.")
			c.IndentedJSON(http.StatusUnauthorized, make([]MapItem, 0))
		} else {
			var validators []MapItem

			if err := c.BindJSON(&validators); err != nil {
				log.Error("Error while writing validators", err, log.Bloxberg)
				c.IndentedJSON(http.StatusInternalServerError, validators)
				return
			}

			if err := storeMapValidators(validators, mapValidatorsStorePath); err != nil {
				log.Error("Error while writing validators", err, log.Bloxberg)
				c.IndentedJSON(http.StatusInternalServerError, validators)
				return
			}

			c.IndentedJSON(http.StatusCreated, validators)
		}
	})

	router.POST("/geoMpgInstitutes", func(c *gin.Context) {
		provided_api_password := c.GetHeader("hatnote-gis-api-password")
		if provided_api_password != api_password {
			log.Info("Access to POST /geoMpgInstitutes denied: wrong password.")
			c.IndentedJSON(http.StatusUnauthorized, make([]MapItem, 0))
		} else {
			var institutes []MapItem

			if err := c.BindJSON(&institutes); err != nil {
				log.Error("Error while writing validators", err, log.General)
				c.IndentedJSON(http.StatusInternalServerError, institutes)
				return
			}

			if err := storeMapInstitutes(institutes, mapInstitutesStorePath); err != nil {
				log.Error("Error while writing validators", err, log.General)
				c.IndentedJSON(http.StatusInternalServerError, institutes)
				return
			}

			c.IndentedJSON(http.StatusCreated, institutes)
		}
	})

	log.Info("Starting world map api endpoint server ...")
	go func() {
		router.Run(fmt.Sprintf("0.0.0.0:%d", apiPort))
	}()
}
