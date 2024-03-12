package endpoint

type MapItem struct {
	Name       string     `json:"name"`
	Id         string     `json:"id"`
	Coordinate Coordinate `json:"coordinate"`
	CountryId  string     `json:"countryId"`
	StateId    string     `json:"stateId"`
}

type Coordinate struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}
