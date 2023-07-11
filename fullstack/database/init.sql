CREATE DATABASE IF NOT EXISTS greenthumb_hub_database;

USE greenthumb_hub_database;

CREATE TABLE IF NOT EXISTS `UserGardens` (
    id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    garden_id INTEGER NOT NULL,
    PRIMARY KEY (id, user_id, garden_id),
    FOREIGN KEY(garden_id) REFERENCES garden (id),
    FOREIGN KEY(user_id) REFERENCES user (id)
);