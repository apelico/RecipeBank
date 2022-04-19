package models

type Ticket struct {
	Subject       string   `bson:"subject"`
	Priority      string   `bson:"priority"`
	Type          string   `bson:"type"`
	Description   string   `bson:"description"`
	Impact        string   `bson:"impact"`
	CreationDate  int64    `bson:"creationDate"`
	CloseDate     int64    `bson:"closeDate"`
	AssignedUsers []string `bson:"assignedUsers"`
	Creator       string   `bson:"creator"`
	Status        string   `bson:"status"`
	ID            int      `bson:"id"`
}
